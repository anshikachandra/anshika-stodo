#!/bin/bash
# Start both backend and frontend servers

echo "Starting Todo App..."
echo ""

# Start backend
echo "Starting backend (MongoDB + Express) on port 3001..."
cd Server && npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend
echo "Starting frontend (Vite) on port 5173..."
cd ../todolist && npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 2

echo ""
echo "✅ Backend running on http://localhost:3001 (PID: $BACKEND_PID)"
echo "✅ Frontend running on http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""
echo "Opening browser..."
xdg-open http://localhost:5173

echo ""
echo "To stop servers, run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "View logs:"
echo "  Backend: tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
