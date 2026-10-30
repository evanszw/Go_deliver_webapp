@echo off
cd /d "C:\Users\evs\Desktop\Go-deliver\backend"
start /b node dist/index.js
timeout /t 3 >nul
curl -s --max-time 5 http://localhost:3000/api/health
