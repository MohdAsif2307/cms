# HMS Full Project (Backend + Frontend)
This archive contains:
- backend/  -> Express + Mongoose API (from starter)
- frontend/ -> Vite + React + Tailwind frontend scaffold (wired to backend)

Quick start:
1. Start backend:
   cd backend
   npm install
   cp .env.example .env
   # edit .env and set MONGO_URI and JWT_SECRET
   npm run dev

2. Start frontend:
   cd frontend
   npm install
   cp .env.example .env
   npm run dev

Frontend uses VITE_API_URL to connect to backend (default http://localhost:5000/api).
