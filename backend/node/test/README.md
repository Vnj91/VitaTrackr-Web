This folder contains test helpers and integration tests.

- `checks.js` is a lightweight health-check runner used as a fallback when dev dependencies are not installed locally. It is safe to run with `node test/checks.js`.
- `auth.int.test.js` is an integration test that requires `mongodb-memory-server`, `jest`, and `supertest`. These are installed and run in CI. If you want to run integration tests locally, install dev dependencies (`npm ci`) first.
