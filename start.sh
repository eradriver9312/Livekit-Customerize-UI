
#!/bin/bash

# Start the Python backend in the background
python tavus.py &

# Wait a moment for the backend to initialize
sleep 2

# Start the Next.js frontend
npm run dev
