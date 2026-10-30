@echo off
cd /d "C:\Users\evs\Desktop\Go-deliver"
echo Starting Vite dev server on port 5173 (all interfaces)...
node node_modules\vite\bin\vite.js --config frontend/vite.config.ts --port 5173 --host > vite.log 2>&1
