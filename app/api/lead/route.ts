import { NextRequest, NextResponse } from 'next/server';
import { LeadCaptureSchema } from '@/lib/schema';
import { rateLimitMiddleware } from '@/lib/rateLimit';
import fs from 'fs';
import path from 'path';

// In-memory deduplication store (resets on server restart)
const leadStore = new Set<string>();

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

    // Rate limiting (more lenient for lead capture)
    const rateLimit = await rateLimitMiddleware(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validationResult = LeadCaptureSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, consent, context } = validationResult.data;

    // Check if email is required
    const requireEmail = process.env.LEAD_REQUIRE_EMAIL === 'true';
    if (requireEmail && !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
          message: 'Please provide an email address to continue.',
        },
        { status: 400 }
      );
    }

    // Check consent if email provided
    if (email && !consent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Consent required',
          message: 'Please provide consent to store your email address.',
        },
        { status: 400 }
      );
    }

    // Deduplication check
    const emailKey = email?.toLowerCase() || 'anonymous';
    if (leadStore.has(emailKey)) {
      return NextResponse.json(
        {
          success: true,
          message: 'Lead already captured',
        },
        { status: 200 }
      );
    }

    // Store lead
    const leadData = {
      email: email || null,
      consent: consent || false,
      context: context || 'lease_generator',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Add to in-memory store
    leadStore.add(emailKey);

    // Save to CSV file
    await saveLeadToCSV(leadData);

    // Send webhook if configured
    if (process.env.LEAD_WEBHOOK_URL) {
      await sendLeadWebhook(leadData).catch(error => {
        console.error('Lead webhook failed:', error);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully',
    });

  } catch (error) {
    console.error('Lead capture error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to capture lead. Please try again.',
      },
      { status: 500 }
    );
  }
}

async function saveLeadToCSV(leadData: any): Promise<void> {
  try {
    const csvPath = path.join(process.cwd(), 'tmp', 'leads.csv');
    const csvDir = path.dirname(csvPath);
    
    // Ensure directory exists
    if (!fs.existsSync(csvDir)) {
      fs.mkdirSync(csvDir, { recursive: true });
    }

    // Check if file exists to determine if we need headers
    const fileExists = fs.existsSync(csvPath);
    
    // CSV row
    const csvRow = [
      leadData.timestamp,
      leadData.email || '',
      leadData.consent ? 'true' : 'false',
      leadData.context,
      leadData.ip,
      leadData.userAgent.replace(/,/g, ';'), // Escape commas in user agent
    ].join(',');

    // Add headers if file doesn't exist
    const content = fileExists ? csvRow : 
      'timestamp,email,consent,context,ip,user_agent\n' + csvRow;

    fs.appendFileSync(csvPath, content + '\n');
  } catch (error) {
    console.error('Failed to save lead to CSV:', error);
    // Don't throw - this is not critical
  }
}

async function sendLeadWebhook(leadData: any): Promise<void> {
  try {
    const response = await fetch(process.env.LEAD_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'lead_capture',
        data: leadData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Lead webhook error:', error);
    throw error;
  }
}
