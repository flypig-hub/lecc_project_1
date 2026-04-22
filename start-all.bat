@echo off
echo Starting RPG Bank Full Stack Application...
echo.
echo Starting Backend...
start "RPG Bank Backend" cmd /k "cd backend && gradlew bootRun"

echo.
echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo.
echo Starting Frontend...
start "RPG Bank Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo H2 Console: http://localhost:8080/h2-console
echo.
pause
