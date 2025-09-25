# 🚀 Local Development Guide

## Quick Start

### 1. Install Node.js (if not already installed)

**Option A: Using Homebrew (macOS)**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

**Option B: Download from [nodejs.org](https://nodejs.org/)**
- Download and install the LTS version

### 2. Verify Installation
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### 3. Install Dependencies
```bash
cd lease-generator
npm install
```

### 4. Set Up Environment Variables
```bash
# Copy the example environment file
cp env.example .env.local

# Edit with your API keys
nano .env.local
```

**Required for full functionality:**
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
```

**For local testing (minimal setup):**
```env
OPENAI_API_KEY=sk-mock-key-for-local-testing
CAPTCHA_PROVIDER=none
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Open Your Browser
Navigate to: **http://localhost:3000**

## 🎯 What You'll See

### Landing Page
- Clean, professional interface
- Multi-step lease generation form
- Progress indicator
- Responsive design

### Form Sections
1. **Jurisdiction** - Country, state, city
2. **Parties** - Landlord and tenant information
3. **Property** - Address and type
4. **Term** - Lease duration and dates
5. **Financials** - Rent, deposits, late fees
6. **Pets** - Pet policy and fees
7. **Rules** - Smoking, parking, subletting
8. **Signatures** - Electronic or wet signatures

### Generated Output
- Professional DOCX document
- Jurisdiction-specific clauses
- Proper legal formatting
- Download functionality

## 🔧 Development Features

### Hot Reload
- Changes to code automatically refresh the browser
- Fast development cycle

### TypeScript Support
- Full type checking
- IntelliSense in your editor
- Compile-time error detection

### Tailwind CSS
- Utility-first styling
- Responsive design
- Custom component classes

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Generate Lease (with mock data)
```bash
curl -X POST http://localhost:3000/api/generate-lease \
  -H "Content-Type: application/json" \
  -d @examples/sample-request.json \
  --output test-lease.docx
```

### Lead Capture
```bash
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "consent": true}'
```

## 🐛 Troubleshooting

### Common Issues

**1. "Module not found" errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. "Port 3000 already in use"**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**3. TypeScript errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

**4. Tailwind not working**
```bash
# Rebuild CSS
npm run build
```

### Development Tips

1. **Use the browser dev tools** to inspect the form
2. **Check the console** for any JavaScript errors
3. **Test the API endpoints** using the provided curl examples
4. **Modify the form** by editing `components/LeaseForm.tsx`
5. **Add new jurisdictions** by creating files in `lib/templates/jurisdictions/`

## 📁 Project Structure

```
lease-generator/
├── app/                    # Next.js pages and API routes
├── components/            # React components
├── lib/                   # Core business logic
├── examples/              # Sample data and tests
├── public/                # Static assets
└── README.md              # Documentation
```

## 🚀 Next Steps

1. **Test the form** - Fill out all sections
2. **Generate a lease** - See the DOCX output
3. **Customize the UI** - Modify components
4. **Add jurisdictions** - Create new clause files
5. **Deploy to production** - Use Vercel or Netlify

## 💡 Pro Tips

- Use **VS Code** with the **Tailwind CSS IntelliSense** extension
- Enable **TypeScript** in your editor for better development experience
- Use **React Developer Tools** browser extension
- Check the **Network tab** to see API calls
- Use **console.log()** for debugging

Happy coding! 🎉
