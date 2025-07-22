@echo off
echo Starting GuardChain...
start cmd /k "powershell -ExecutionPolicy Bypass -File start-guardchain.ps1"
timeout /t 10
start cmd /k "powershell -ExecutionPolicy Bypass -File start-realtime.ps1"
