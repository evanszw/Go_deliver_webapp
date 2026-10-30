@echo off
cd /d C:\Users\evs\Desktop\Go-deliver
node node_modules\vite\bin\vite.js --config frontend/vite.config.ts --port 5173 > frontend.log 2>&1
