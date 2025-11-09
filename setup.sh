#!/bin/bash

# Image Sharing System - Build & Run Script
# This script helps set up and run the application

set -e

echo "🚀 Image Sharing System - Build & Run"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install it first."
    exit 1
fi
echo -e "${GREEN}✅ npm: $(npm --version)${NC}"

echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Frontend dependencies already installed${NC}"
fi

# Install backend dependencies
if [ ! -d "server/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd server
    npm install
    cd ..
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Environment setup...${NC}"

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env file..."
    cat > server/.env << 'EOF'
PORT=4000
JWT_SECRET=your_jwt_secret_key_change_this
MONGODB_URI=mongodb://localhost:27017/image-sharing-system
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@imagesite.com
CLIENT_URL=http://localhost:3000
EOF
    echo -e "${YELLOW}⚠️  Created server/.env (Please update with your values)${NC}"
else
    echo -e "${GREEN}✅ server/.env already exists${NC}"
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:4000/api
EOF
    echo -e "${GREEN}✅ Created .env${NC}"
else
    echo -e "${GREEN}✅ .env already exists${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "======================================"
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""
echo "1. Install json-server globally (if not installed):"
echo "   npm install -g json-server"
echo ""
echo "2. Open 3 terminals and run:"
echo ""
echo -e "${YELLOW}   Terminal 1 (JSON Server):${NC}"
echo "   json-server --watch database.json --port 5000"
echo ""
echo -e "${YELLOW}   Terminal 2 (Backend):${NC}"
echo "   cd server && npm run dev"
echo ""
echo -e "${YELLOW}   Terminal 3 (Frontend):${NC}"
echo "   npm start"
echo ""
echo "3. Open browser to:"
echo -e "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "======================================"
echo -e "${GREEN}Ready to go! 🎉${NC}"
