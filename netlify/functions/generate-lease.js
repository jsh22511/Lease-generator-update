const { LeaseInputSchema, LeaseOutputSchema } = require('../../lib/schema');
const { createLLMProvider } = require('../../lib/llm');
const { generateLeaseDocx, getDocumentMimeType, getDocumentExtension } = require('../../lib/pdf');
const { rateLimitMiddleware } = require('../../lib/rateLimit');
const { verifyCaptcha, isCaptchaRequired } = require('../../lib/captcha');
const { logTokenUsage, trackDailyCost } = require('../../lib/telemetry');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // 1. Rate Limiting
    const rateLimit = await rateLimitMiddleware(event);
    if (!rateLimit.success) {
      return {
        statusCode: rateLimit.status,
        headers: {
          ...headers,
          ...rateLimit.headers,
        },
        body: JSON.stringify({
          success: false,
          error: rateLimit.error,
        }),
      };
    }

    const body = JSON.parse(event.body);
    console.log('Received request body:', JSON.stringify(body, null, 2));

    // 2. Captcha Verification (if required)
    if (isCaptchaRequired()) {
      const captchaToken = body.captchaToken;
      if (!captchaToken) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Captcha token missing' }),
        };
      }
      const captchaVerified = await verifyCaptcha(captchaToken);
      if (!captchaVerified) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ success: false, error: 'Captcha verification failed' }),
        };
      }
    }

    // 3. Input Validation
    const inputValidation = LeaseInputSchema.safeParse(body);
    if (!inputValidation.success) {
      console.error('Input validation failed:', inputValidation.error.errors);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid input data',
          details: inputValidation.error.errors,
        }),
      };
    }
    const validatedInput = inputValidation.data;

    // 4. LLM Call
    const llmProvider = createLLMProvider();
    const { leaseData, tokenUsage, estimatedCost } = await llmProvider.generateLease(validatedInput);

    // 5. LLM Output Validation
    const outputValidation = LeaseOutputSchema.safeParse(leaseData);
    if (!outputValidation.success) {
      console.error('LLM output validation failed:', outputValidation.error);
      console.error('LLM returned:', JSON.stringify(leaseData, null, 2));
      
      const missingFields = outputValidation.error.errors.map(err => err.path.join('.'));
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid lease data generated',
          message: `Missing or invalid fields: ${missingFields.join(', ')}. Please try again.`,
          details: outputValidation.error.errors,
        }),
      };
    }

    // 6. Telemetry Logging
    logTokenUsage(tokenUsage);
    trackDailyCost(estimatedCost);

    // 7. Document Generation (DOCX)
    const docxBuffer = await generateLeaseDocx(leaseData);

    // Return the document
    const format = 'docx';
    const filename = `lease-${Date.now()}${getDocumentExtension(format)}`;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': getDocumentMimeType(format),
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Rate-Limit-Remaining': rateLimit.remaining.toString(),
        'X-Rate-Limit-Reset': rateLimit.resetTime.toString(),
        ...headers,
      },
      body: Buffer.from(docxBuffer).toString('base64'),
      isBase64Encoded: true,
    };

  } catch (error) {
    console.error('Lease generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: `An unexpected error occurred: ${errorMessage}. Please try again.`,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      }),
    };
  }
};
