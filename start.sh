
#!/bin/bash
set -e

# Download required models first
echo "Downloading required models..."
python tavus.py download-files || echo "Model download failed, continuing..."

# Start the Python backend in the background
echo "Starting Python backend..."
python tavus.py dev &
BACKEND_PID=$!

# Wait longer for the backend to initialize
echo "Waiting for backend to initialize..."
sleep 10

# Start the Next.js frontend
echo "Starting Next.js frontend..."
npm run dev
