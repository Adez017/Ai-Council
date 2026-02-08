@echo off
REM AI Council Development Server Startup Script

echo.
echo ========================================
echo   AI Council Development Servers
echo ========================================
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo ERROR: backend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist "frontend" (
    echo ERROR: frontend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo Starting Backend Server...
start "AI Council Backend" cmd /k "cd backend && poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "AI Council Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8000
echo API Docs:  http://localhost:8000/api/v1/docs
echo.
echo Please wait 10-15 seconds for servers to fully start...
echo.
echo To stop servers: Close the command windows or press CTRL+C
echo.

timeout /t 8 /nobreak >nul
echo Opening browser...
start http://localhost:3000

echo.
echo All set! Happy testing!
echo.
pause
