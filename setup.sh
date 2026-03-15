#!/bin/bash
# BharatShield — One-command setup script
# Run: bash setup.sh

echo "🛡️  BharatShield Setup"
echo "========================"
echo "India Defence Intelligence Dashboard"
echo "Atmanirbhar Bharat — Made in India 🇮🇳"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js v18+ from https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js v18+ required. Current: $(node -v)"
  exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ npm install failed. Check your internet connection."
  exit 1
fi

echo "✅ Dependencies installed"

# Create .env.local if not exists
if [ ! -f .env.local ]; then
  cp .env.example .env.local 2>/dev/null || cat > .env.local << EOF
# BharatShield Environment Variables
# Add your API keys here (all optional — app works without them)

# Claude API key (optional — for deep AI classification)
VITE_CLAUDE_API_KEY=

# Bhashini API key (optional — for official Indian translation)
VITE_BHASHINI_API_KEY=

# Groq API key (optional — free, fast AI inference)
VITE_GROQ_API_KEY=
EOF
  echo "✅ .env.local created (add API keys for full features)"
fi

echo ""
echo "🚀 Starting BharatShield..."
echo ""
echo "   Open: http://localhost:3000"
echo ""
echo "   Features available without API keys:"
echo "   ✅ India map with state threat levels"
echo "   ✅ Live news feed (PIB, NDRF, IMD, CERT-In)"
echo "   ✅ Keyword-based threat classification"
echo "   ✅ All 22 Indian languages"
echo ""
echo "   Features requiring API keys:"
echo "   🔑 Deep AI classification (Claude API key)"
echo "   🔑 Official translation (Bhashini API key)"
echo ""

npm run dev
