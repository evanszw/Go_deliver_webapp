@echo off
cd /d "C:\Users\evs\Desktop\Go-deliver"
echo "=== Starting Backend on port 3000 ==="
start /b node backend/dist/index.js
timeout /t 2 >nul
echo "=== Starting Frontend on port 5173 ==="
start /b node node_modules\vite\bin\vite.js --config frontend/vite.config.ts --port 5173
timeout /t 3 >nul
echo "=== Both servers started ==="
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"
