import { NextRequest, NextResponse } from 'next/server';
import { LeaseInputSchema, LeaseOutputSchema } from '@/lib/schema';
import { createLLMProvider } from '@/lib/llm';
import { generateLeaseDocx, getDocumentMimeType, getDocumentExtension } from '@/lib/pdf';
import { rateLimitMiddleware } from '@/lib/rateLimit';
import { verifyCaptcha, isCaptchaRequired } from '@/lib/captcha';
import { logTokenUsage, trackDailyCost } from '@/lib/telemetry';

export async function POST(request: NextRequest) {
  try {
    // CORS check
    const origin = request.headers.get('origin');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { success: false, error: 'CORS policy violation' },
        { status: 403 }
      );
    }

    // Rate limiting
    const rateLimit = await rateLimitMiddleware(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds.`,
          resetTime: rateLimit.resetTime,
        },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    const validationResult = LeaseInputSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Schema validation failed:', validationResult.error.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const input = validationResult.data;

    // Captcha verification
    if (isCaptchaRequired() && input.captchaToken) {
      const captchaResult = await verifyCaptcha(input.captchaToken);
      if (!captchaResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Captcha verification failed',
            message: captchaResult.error,
          },
          { status: 400 }
        );
      }
    }

    // Generate lease content using LLM
    const llmProvider = createLLMProvider();
    const leaseData = await llmProvider.generateLease(input);

    // Validate LLM output
    const outputValidation = LeaseOutputSchema.safeParse(leaseData);
    if (!outputValidation.success) {
      console.error('LLM output validation failed:', outputValidation.error);
      console.error('LLM returned:', JSON.stringify(leaseData, null, 2));
      
      // Try to provide more helpful error message
      const missingFields = outputValidation.error.errors.map(err => err.path.join('.'));
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid lease data generated',
          message: `Missing or invalid fields: ${missingFields.join(', ')}. Please try again.`,
          details: outputValidation.error.errors,
        },
        { status: 422 }
      );
    }

    // Track token usage and cost
    if (leaseData.metadata.tokenUsage) {
      logTokenUsage(
        leaseData.metadata.tokenUsage,
        leaseData.metadata.model,
        `Lease generation for ${input.jurisdiction.country}`
      );

      const cost = calculateCost(leaseData.metadata.tokenUsage, leaseData.metadata.model);
      if (!trackDailyCost(cost)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Daily cost limit exceeded',
            message: 'Service temporarily unavailable due to cost limits.',
          },
          { status: 503 }
        );
      }
    }

    // Generate DOCX document
    const docxBuffer = await generateLeaseDocx(leaseData);

    // Return the document
    const format = 'docx'; // Could be made configurable
    const filename = `lease-${Date.now()}${getDocumentExtension(format)}`;
    
    return new Response(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        'Content-Type': getDocumentMimeType(format),
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Rate-Limit-Remaining': rateLimit.remaining.toString(),
        'X-Rate-Limit-Reset': rateLimit.resetTime.toString(),
      },
    });

  } catch (error) {
    console.error('Lease generation error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate cost (moved from telemetry for direct access)
function calculateCost(tokens: { prompt: number; completion: number; total: number }, model: string): number {
  const MODEL_PRICING = {
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    'gpt-4': { input: 0.03, output: 0.06 },
  };

  const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING];
  if (!pricing) return 0;

  const inputCost = (tokens.prompt / 1000) * pricing.input;
  const outputCost = (tokens.completion / 1000) * pricing.output;
  
  return inputCost + outputCost;
}
