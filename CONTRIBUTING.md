# Contributing & Developer cheatsheet

Quick setup

- Frontend:
  - cd frontend
  - npm install
  - npm run dev

- Backend (Node):
  - cd backend/node
  - npm install
  - copy .env.example .env and edit values
  - node seed.js
  - npm run dev

Running tests

- CI: See `.github/workflows/ci.yml` (frontend lint + typecheck, backend tests)
- Locally: `cd backend/node && npm test` runs a lightweight health check when dev deps are not installed. CI will run full tests with jest.

Docker / local compose

- Start services with Docker Compose (requires docker):
  - docker-compose up --build

Common troubleshooting

- If `npm ci` fails with ETARGET, your npm registry may be constrained; update package versions or run CI to validate in a clean environment.
