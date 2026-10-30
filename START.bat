@echo off
cd /d "C:\Users\evs\Desktop\Go-deliver"
echo Starting Go Deliver servers...
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
start /b node backend/dist/index.js
ping -n 3 127.0.0.1 >nul
start "" node node_modules\vite\bin\vite.js --config frontend/vite.config.ts --port 5173
