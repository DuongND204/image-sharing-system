@echo off
REM Image Sharing System - Setup Script for Windows
REM This script helps set up the application

echo.
echo ====================================
echo Image Sharing System - Setup
echo ====================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js first from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js is installed

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo [OK] npm is installed
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
if not exist "node_modules" (
    call npm install
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

REM Install backend dependencies
echo Installing backend dependencies...
if not exist "server\node_modules" (
    cd server
    call npm install
    cd ..
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)

echo.

REM Create .env files if they don't exist
if not exist "server\.env" (
    echo Creating server\.env file...
    (
        echo PORT=4000
        echo JWT_SECRET=your_jwt_secret_key_change_this
        echo MONGODB_URI=mongodb://localhost:27017/image-sharing-system
        echo EMAIL_SERVICE=gmail
        echo EMAIL_USERNAME=your_email@gmail.com
        echo EMAIL_PASSWORD=your_app_password
        echo EMAIL_FROM=noreply@imagesite.com
        echo CLIENT_URL=http://localhost:3000
    ) > server\.env
    echo [WARNING] Created server\.env (Please update with your values)
) else (
    echo [OK] server\.env already exists
)

if not exist ".env" (
    echo Creating .env file...
    (
        echo REACT_APP_API_URL=http://localhost:4000/api
    ) > .env
    echo [OK] Created .env
) else (
    echo [OK] .env already exists
)

echo.
echo ====================================
echo [OK] Setup complete!
echo ====================================
echo.
echo NEXT STEPS:
echo.
echo 1. Install json-server globally (if not installed):
echo    npm install -g json-server
echo.
echo 2. Open 3 terminals (cmd or PowerShell) and run:
echo.
echo    Terminal 1 (JSON Server):
echo    json-server --watch database.json --port 5000
echo.
echo    Terminal 2 (Backend):
echo    cd server ^&^& npm run dev
echo.
echo    Terminal 3 (Frontend):
echo    npm start
echo.
echo 3. Open browser to:
echo    http://localhost:3000
echo.
echo ====================================
echo [SUCCESS] Ready to go!
echo ====================================
echo.

pause
