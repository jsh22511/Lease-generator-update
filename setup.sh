#!/bin/bash

echo "🏠 Free Lease Generator - Local Setup"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo "1. Visit https://nodejs.org/"
    echo "2. Download and install the LTS version"
    echo "3. Restart your terminal"
    echo ""
    echo "Or use Homebrew:"
    echo "  brew install node"
    echo ""
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required (current: $(node --version))"
    echo "Please upgrade Node.js"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file
echo ""
echo "⚙️  Setting up environment variables..."
if [ ! -f .env.local ]; then
    cp env.example .env.local
    echo "✅ Created .env.local from template"
    echo ""
    echo "🔧 IMPORTANT: Edit .env.local with your API keys:"
    echo "   - OPENAI_API_KEY=sk-your-key-here"
    echo "   - CAPTCHA_PROVIDER=none (for local testing)"
    echo "   - ALLOWED_ORIGINS=http://localhost:3000"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🚀 Setup complete! Run the following commands:"
echo ""
echo "1. Edit your API keys:"
echo "   nano .env.local"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "🎉 Happy coding!"
