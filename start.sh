
#!/bin/bash
set -e

# Start the Python backend in the background without downloading models
echo "Starting Python backend..."
python tavus.py dev &
BACKEND_PID=$!

# Start the Next.js frontend immediately
echo "Starting Next.js frontend..."
npm run dev
