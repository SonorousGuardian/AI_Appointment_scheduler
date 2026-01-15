#!/bin/bash

# AI Appointment Scheduler - One-Click Installation Script
# This script automatically installs all dependencies for both backend and frontend

echo "=================================="
echo "AI Appointment Scheduler Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version 18+ is required. Current version: $(node -v)"
    echo "Please upgrade from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo "✅ npm $(npm -v) detected"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed!"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Build backend
echo "🔨 Building backend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed!"
    exit 1
fi
echo "✅ Backend built successfully"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed!"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

cd ..

echo "=================================="
echo "✅ Installation Complete!"
echo "=================================="
echo ""
echo "To start the application:"
echo ""
echo "Backend (Terminal 1):"
echo "  cd server"
echo "  npm start"
echo ""
echo "Frontend (Terminal 2):"
echo "  cd client"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo "=================================="
