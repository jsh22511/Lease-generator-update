# Free Lease Generator

A secure, production-ready web application that generates jurisdiction-aware residential lease agreements using AI. Built with Next.js, TypeScript, and designed for serverless deployment on Vercel or Netlify.

## Features

- 🏠 **Jurisdiction-Aware**: Generates leases tailored to specific states/countries
- 🔒 **Secure**: API keys never exposed to client, rate limiting, captcha protection
- 📄 **Professional Output**: Generates DOCX documents with proper formatting
- 💰 **Cost Control**: Token usage tracking and daily cost limits
- 🚀 **Serverless**: Optimized for Vercel/Netlify deployment
- 📱 **Responsive**: Mobile-friendly form interface
- ⚖️ **Legal Compliant**: Includes proper disclaimers and legal notices

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lease-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   OPENAI_API_KEY=sk-your-openai-key-here
   LLM_MODEL=gpt-4o-mini
   CAPTCHA_PROVIDER=recaptcha
   RECAPTCHA_SECRET=your-recaptcha-secret
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure environment variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from `env.example`

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch

### Netlify

1. **Build configuration**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Add environment variables in Netlify dashboard

3. **Configure redirects** (create `public/_redirects`)
   ```
   /api/*  /.netlify/functions/:splat  200
   ```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `LLM_MODEL` | AI model to use | `gpt-4o-mini` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://yourdomain.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LLM_PROVIDER` | LLM provider | `openai` |
| `MAX_INPUT_TOKENS` | Max input tokens | `3000` |
| `MAX_OUTPUT_TOKENS` | Max output tokens | `3000` |
| `RATE_LIMIT_WINDOW_SECONDS` | Rate limit window | `3600` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `20` |
| `CAPTCHA_PROVIDER` | Captcha provider | `recaptcha` |
| `RECAPTCHA_SECRET` | reCAPTCHA secret key | - |
| `HCAPTCHA_SECRET` | hCaptcha secret key | - |
| `REDIS_URL` | Redis URL for rate limiting | - |
| `LEAD_WEBHOOK_URL` | Webhook for lead capture | - |
| `COST_WEBHOOK_URL` | Webhook for cost tracking | - |

## API Endpoints

### Generate Lease
```http
POST /api/generate-lease
Content-Type: application/json

{
  "jurisdiction": {
    "country": "US",
    "state": "CA",
    "city": "San Francisco"
  },
  "landlord": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, San Francisco, CA 94102"
  },
  "tenant": {
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "property": {
    "address": "456 Oak Ave, San Francisco, CA 94102",
    "type": "apartment"
  },
  "term": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "months": 12,
    "renewal": "none"
  },
  "financials": {
    "monthlyRent": 2500,
    "securityDeposit": 2500,
    "lateFee": {
      "type": "flat",
      "value": 50,
      "graceDays": 5
    },
    "prorationMethod": "actual_days",
    "utilitiesIncluded": ["water", "trash"]
  },
  "pets": {
    "allowed": true,
    "fee": 200,
    "deposit": 500,
    "rent": 25,
    "restrictions": "Maximum 2 pets, no aggressive breeds"
  },
  "rules": {
    "smoking": "prohibited",
    "parking": "One assigned space",
    "subletting": "with_consent",
    "alterations": "with_consent",
    "insuranceRequired": true
  },
  "notices": {
    "delivery": "both"
  },
  "signatures": {
    "method": "e-sign"
  },
  "captchaToken": "recaptcha-token"
}
```

### Lead Capture
```http
POST /api/lead
Content-Type: application/json

{
  "email": "user@example.com",
  "consent": true,
  "context": "lease_generator"
}
```

### Health Check
```http
GET /api/health
```

## Security Features

### Rate Limiting
- In-memory rate limiting (fallback)
- Redis-based rate limiting (optional)
- Per-IP and per-session limits
- Configurable windows and limits

### Captcha Protection
- reCAPTCHA v3 support
- hCaptcha support
- Server-side verification
- Optional (can be disabled)

### CORS Protection
- Configurable allowed origins
- Strict origin checking
- Prevents unauthorized access

### Input Validation
- Zod schema validation
- Type-safe input handling
- Comprehensive error messages

## Cost Management

### Token Tracking
- Automatic token usage logging
- Cost calculation per request
- Daily cost limits
- Webhook notifications

### Budget Controls
- Configurable daily limits
- Hard stops on budget exceeded
- Cost telemetry and alerts

## Adding New Jurisdictions

1. **Create jurisdiction file**
   ```typescript
   // lib/templates/jurisdictions/US-TX.ts
   export const texasClauses = {
     // Texas-specific clauses
   };
   ```

2. **Update prompt system**
   ```typescript
   // lib/prompts.ts
   case 'US-TX':
     return getAllTexasClauses();
   ```

3. **Test with sample data**
   ```bash
   curl -X POST /api/generate-lease \
     -H "Content-Type: application/json" \
     -d '{"jurisdiction": {"country": "US", "state": "TX"}}'
   ```

## Development

### Project Structure
```
/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── page.tsx           # Home page
│   ├── terms/             # Terms page
│   └── privacy/           # Privacy page
├── components/            # React components
├── lib/                   # Core library
│   ├── llm.ts            # LLM abstraction
│   ├── pdf.ts            # Document generation
│   ├── rateLimit.ts      # Rate limiting
│   ├── captcha.ts        # Captcha verification
│   ├── telemetry.ts      # Cost tracking
│   ├── schema.ts         # Zod schemas
│   ├── prompts.ts        # Prompt templates
│   └── templates/        # Clause templates
└── public/               # Static assets
```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Lint code
npm run lint

# Type check
npm run type-check
```

### Sample Data

See `examples/` directory for sample API requests and expected responses.

## Legal Disclaimer

This tool generates lease templates for informational purposes only. This is not legal advice. Always consult with a qualified attorney before using any lease agreement.

## Support

For issues and questions:
1. Check the documentation
2. Review the examples
3. Open a GitHub issue
4. Contact support

## License

MIT License - see LICENSE file for details.
