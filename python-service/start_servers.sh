#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p logs

# Activate virtual environment
source venv/bin/activate

# Ensure we're using virtualenv's pip
pip install -r requirements.txt

# Start WebSocket server (on port 8002)
python websocket_server.py &
WEBSOCKET_PID=$!

echo "Starting WebSocket server on port 8002..."

# Wait a bit for WebSocket server to start
sleep 2

# Start FastAPI server
python main.py

# Cleanup on exit
trap 'kill $WEBSOCKET_PID' EXIT
