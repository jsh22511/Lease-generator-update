interface CaptchaResponse {
  success: boolean;
  error?: string;
}

export async function verifyCaptcha(token: string, provider: string = 'recaptcha'): Promise<CaptchaResponse> {
  if (!token) {
    return { success: false, error: 'No captcha token provided' };
  }

  switch (provider.toLowerCase()) {
    case 'recaptcha':
      return await verifyRecaptcha(token);
    case 'hcaptcha':
      return await verifyHcaptcha(token);
    case 'none':
      return { success: true };
    default:
      return { success: false, error: 'Invalid captcha provider' };
  }
}

async function verifyRecaptcha(token: string): Promise<CaptchaResponse> {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) {
    console.warn('RECAPTCHA_SECRET not configured, skipping verification');
    return { success: true };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: `reCAPTCHA verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}` 
      };
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Failed to verify reCAPTCHA' };
  }
}

async function verifyHcaptcha(token: string): Promise<CaptchaResponse> {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) {
    console.warn('HCAPTCHA_SECRET not configured, skipping verification');
    return { success: true };
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: `hCaptcha verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}` 
      };
    }
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return { success: false, error: 'Failed to verify hCaptcha' };
  }
}

export function getCaptchaProvider(): string {
  return process.env.CAPTCHA_PROVIDER || 'recaptcha';
}

export function isCaptchaRequired(): boolean {
  const provider = getCaptchaProvider();
  return provider !== 'none';
}
