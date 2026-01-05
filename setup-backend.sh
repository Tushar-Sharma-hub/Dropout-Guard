#!/bin/bash

# DropoutGuard Backend Setup Script
# This script helps set up your Firebase backend

echo "🚀 DropoutGuard Backend Setup"
echo "================================"
echo ""

# Check if Firebase is installed
if [ ! -d "node_modules/firebase" ]; then
    echo "📦 Installing Firebase..."
    npm install firebase
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Firebase. Please run: npm install firebase"
        exit 1
    fi
    echo "✅ Firebase installed"
else
    echo "✅ Firebase already installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo "Creating .env.example for reference..."
    
    cat > .env.example << 'EOF'
# Firebase Configuration
# Get these values from Firebase Console: https://console.firebase.google.com/
# Project Settings > General > Your apps > Firebase SDK snippet > Config

VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Google Gemini API (Optional - for future AI integration)
VITE_GEMINI_API_KEY=your-gemini-api-key-here
EOF
    
    echo ""
    echo "📝 Please create a .env file with your Firebase configuration."
    echo "   Copy .env.example to .env and fill in your values."
    echo ""
    echo "   Steps:"
    echo "   1. Go to https://console.firebase.google.com/"
    echo "   2. Create a project (or select existing)"
    echo "   3. Enable Authentication (Email/Password)"
    echo "   4. Create Firestore database (test mode)"
    echo "   5. Get your config from Project Settings"
    echo "   6. Copy values to .env file"
    echo ""
    read -p "Press Enter when you've created .env file..."
fi

# Check if seed script dependencies are installed
if ! npm list dotenv tsx &> /dev/null; then
    echo ""
    echo "📦 Installing seed script dependencies..."
    npm install --save-dev dotenv tsx
    echo "✅ Dependencies installed"
fi

# Check if .env has actual values (not placeholders)
if [ -f ".env" ]; then
    if grep -q "your-api-key-here" .env 2>/dev/null; then
        echo ""
        echo "⚠️  .env file still contains placeholder values!"
        echo "   Please update .env with your actual Firebase config."
        echo ""
        read -p "Press Enter to continue anyway (seed script will fail if config is invalid)..."
    fi
fi

echo ""
echo "🌱 Running seed script..."
echo ""

# Run seed script
npx tsx scripts/seedFirebase.ts

if [ $? -eq 0 ]; then
    echo ""
    echo "✨ Setup complete!"
    echo ""
    echo "📊 Your Firebase backend is ready!"
    echo "   - Teacher: teacher@dropoutguard.edu / teacher123"
    echo "   - Students: [student-email]@university.edu / student123"
    echo ""
    echo "🚀 You can now use Firebase services in your app!"
else
    echo ""
    echo "❌ Seed script failed. Please check:"
    echo "   1. .env file has correct Firebase config"
    echo "   2. Firebase project is set up correctly"
    echo "   3. Authentication is enabled"
    echo "   4. Firestore database is created"
    exit 1
fi

