# VitaTrack Node AI Backend

Simple Express scaffold exposing AI + core endpoints. Configure `.env` (copy `.env.example`).

Required environment variables:
- OPENAI_API_KEY
- MONGO_URI (defaults to mongodb://127.0.0.1:27017/vitatrack)

Run locally:

1. npm install
2. npm run dev

Core endpoints:
- POST /api/recipes/generate  - proxy to OpenAI (body: { ingredients, user })
- POST /api/workouts/log      - body: { userId, type, durationMin, calories, date, details }
- GET  /api/workouts/user/:userId
- GET  /api/profile/:userId
- POST /api/profile/:userId
- POST /api/goals
- GET  /api/goals/user/:userId

Seed sample data:
- node seed.js

Notes about recent changes:
- The seed script is now idempotent: it will not recreate the sample user or workouts if they already exist for today.
- Cookies set by auth endpoints now include SameSite='lax' and explicit secure/httpOnly flags for improved security.


Notes:
- Authentication is not implemented. Add JWT/OAuth before production.
- The OpenAI integration expects JSON-like responses; the service tries to parse assistant output as JSON.

PowerShell quick start (from project root):

```powershell
cd e:/VitaTrackr/backend/node
npm install
copy .env.example .env
# edit .env to set MONGO_URI, JWT_SECRET, OPENAI_API_KEY, PORT
node seed.js
npm run dev
```

Verify seed data:

```powershell
# fetch seeded workouts (example)
Invoke-RestMethod http://localhost:5001/api/workouts
```

