# VitaTrack

Monorepo scaffold for VitaTrack: frontend (Next.js + Tailwind), backend Node (AI + Auth), backend Spring Boot (analytics). This scaffold contains placeholder code to get started.

Run frontend:
- cd frontend
- npm install
- npm run dev

Run node backend (AI):
- cd backend/node
- npm install
- set OPENAI_API_KEY=<key> (Windows PowerShell: $env:OPENAI_API_KEY = 'key')
- npm run dev

Run spring boot service:
- cd backend/springboot
- ./gradlew bootRun

MongoDB:
- Set MONGO_URI in backend/node/.env or use local MongoDB at mongodb://127.0.0.1:27017/vitatrack
 
## Dev workflow (quick start)

1. Install dependencies

 - Frontend:
 ```powershell
 cd frontend; npm install
 ```

 - Backend (Node):
 ```powershell
 cd backend/node; npm install
 ```

2. Seed sample data (creates a demo user and two workouts)

```powershell
cd backend/node
node seed.js
```

3. Start services

 - Quick way: run the bundled PowerShell helper (Windows):

```powershell
.\start-all.ps1
```

This will open new PowerShell windows to start the Node backend and the Next frontend. The script attempts to start `mongod` if it's on your PATH; otherwise start MongoDB manually.

4. Dev UI

 - Open http://localhost:3000/dev to view seeded users, sample workouts, sample recipe and analytics proxy results.
 - Use "Open Mock Login" to simulate logging in as a seeded user.

Docker Compose (local dev)

You can run the full stack (frontend + backend + MongoDB) using Docker Compose. From the repository root:

```powershell
docker-compose up --build
```

For live code mounts during development (requires Docker on your machine), you can use the provided override:

```powershell
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
```


5. Environment variables

 - `OPENAI_API_KEY` — required if you want the AI route to call OpenAI.
 - `MONGO_URI` — optional, defaults to mongodb://127.0.0.1:27017/vitatrack
 - `SPRINGBOOT_URL` — optional, set to the Spring Boot analytics URL (default http://localhost:8080). If unset or unreachable, the analytics proxy returns mock data.

Notes

 - Dev-only endpoints live under `/api/debug`, `/api/workouts/sample`, `/api/recipes/sample`.
 - The analytics proxy is at `/api/analytics/proxy/workouts/:userId` and will return either Spring data or mock analytics for development convenience.

CI and tests

- A GitHub Actions workflow is included at `.github/workflows/ci.yml` that runs frontend lint/typecheck and backend tests on push/PR to main.
- The backend test script will attempt to use `jest` if available; when jest isn't installed the test script falls back to a lightweight health check (`node test/runChecks.js`).

Troubleshooting

- Port in use: If the backend or frontend fail to start because a port is in use, either stop the process using the port (Windows: use Task Manager or `Get-Process -Id (Get-NetTCPConnection -LocalPort 5001).OwningProcess`) or change PORT/META settings in `.env`.
- Mongo not running: If the Node backend can't connect to Mongo, ensure `mongod` is running or set `MONGO_URI` to a reachable instance. Use `mongo` or MongoDB Compass to verify.
- Spring Boot analytics: If you expect real analytics data, start the Spring Boot service and set `SPRINGBOOT_URL` to its base URL; otherwise the proxy returns mock data.
- OpenAI: To enable actual recipe generation, set `OPENAI_API_KEY` in the backend environment.

New features (calories & AI recipes)
-----------------------------------

- Users can set height/weight/age in the Profile page to calculate BMI and estimate daily required calories.
- The Dashboard plots achieved daily calories and the user's required daily calories.
- The Recipe generator will accept a target calorie value and meal time and attempt to suggest a recipe that matches the target; suggestions are saved to the database and viewable in the Profile page.



