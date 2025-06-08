@echo off
setlocal

REM Set project root to current directory
set "PROJECT_ROOT=%~dp0"

REM Launch backend in a new terminal
start "FastAPI Backend" cmd /k "cd /d %PROJECT_ROOT%backend && uvicorn app:app --reload"

REM Small delay to ensure backend starts first (optional)
timeout /t 2 /nobreak >nul

REM Launch frontend (React + Vite) in another terminal
start "React Frontend" cmd /k "cd /d %PROJECT_ROOT%frontend && npm run dev"

endlocal
