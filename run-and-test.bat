@echo off
set NODE_ENV=production
cd /d "C:\Users\evs\Desktop\Go-deliver"
start /b node backend/dist/index.js
timeout /t 5 >nul
echo "=== Testing API ==="
curl -s http://localhost:3000/api/health
echo ""
echo "=== Testing Frontend ==="
curl -s http://localhost:3000/ | findstr "<html" >nul && echo "Frontend: OK" || echo "Frontend: FAIL"
echo "=== Server is running on http://localhost:3000 ==="
pause
