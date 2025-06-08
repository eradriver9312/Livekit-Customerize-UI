
#!/bin/bash
set -e

# Download required models first
echo "Downloading required models..."
python tavus.py download-files

# Start the Next.js frontend on port 3000 first (required by deployment)
echo "Starting Next.js frontend..."
next dev --port 3000 --hostname 0.0.0.0 &
FRONTEND_PID=$!

# Start the Python backend without dev mode
echo "Starting Python backend..."
python tavus.py &
BACKEND_PID=$!

# Wait for both processes
wait
