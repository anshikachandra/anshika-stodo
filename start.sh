#!/bin/bash
# Start both backend and frontend servers

echo "Starting Todo App..."
echo ""

# Kill any existing processes
echo "Cleaning up old processes..."
lsof -ti:3001,5173,5174 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start backend
echo "Starting backend (MongoDB + Express) on port 3001..."
cd "$SCRIPT_DIR/Server" && npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
echo "Starting frontend (Vite) on port 5173..."
cd "$SCRIPT_DIR/todolist" && npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Check which port Vite is using
VITE_PORT=$(grep -o "http://localhost:[0-9]*" /tmp/frontend.log | head -1 | grep -o "[0-9]*$")
if [ -z "$VITE_PORT" ]; then
    VITE_PORT=5173
fi

echo ""
echo "✅ Backend running on http://localhost:3001 (PID: $BACKEND_PID)"
echo "✅ Frontend running on http://localhost:$VITE_PORT (PID: $FRONTEND_PID)"
echo ""
echo "Opening browser..."
xdg-open http://localhost:$VITE_PORT

echo ""
echo "To stop servers, run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "View logs:"
echo "  Backend: tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
