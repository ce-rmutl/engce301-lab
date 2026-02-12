#!/bin/bash
# setup.sh - Setup and run Task Board application

echo "=========================================="
echo "🚀 Task Board - Setup & Run"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 20+ first:"
    echo "  - Ubuntu/WSL: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs"
    echo "  - macOS: brew install node"
    echo "  - Windows: Download from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if SQLite is installed
if ! command -v sqlite3 &> /dev/null; then
    echo "❌ SQLite3 is not installed!"
    echo "Please install SQLite3 first:"
    echo "  - Ubuntu/WSL: sudo apt install -y sqlite3"
    echo "  - macOS: brew install sqlite3"
    echo "  - Windows: Download from https://sqlite.org/download.html"
    exit 1
fi

echo "✅ SQLite version: $(sqlite3 --version | cut -d' ' -f1)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies!"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create database
echo "💾 Creating database..."
cd database

if [ -f "tasks.db" ]; then
    echo "⚠️  Database already exists. Do you want to recreate it? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        rm tasks.db
        echo "🗑️  Old database deleted"
    else
        echo "ℹ️  Using existing database"
        cd ..
        echo ""
        echo "=========================================="
        echo "🎉 Setup complete!"
        echo "=========================================="
        echo ""
        echo "Run the application:"
        echo "  npm run dev      (with auto-restart)"
        echo "  npm start        (without auto-restart)"
        echo ""
        echo "Then open: http://localhost:3000"
        echo ""
        exit 0
    fi
fi

sqlite3 tasks.db < schema.sql

if [ $? -ne 0 ]; then
    echo "❌ Failed to create database!"
    cd ..
    exit 1
fi

echo "✅ Database created with sample data"
echo ""

# Verify database
echo "📊 Verifying database..."
count=$(sqlite3 tasks.db "SELECT COUNT(*) FROM tasks;")
echo "✅ Database has $count tasks"

cd ..

echo ""
echo "=========================================="
echo "🎉 Setup complete!"
echo "=========================================="
echo ""
echo "🚀 Starting server..."
echo ""
npm run dev
