# VitaTrack Node Backend API

Base URL: http://localhost:5001

## Authentication
The server implements JWT-based authentication. Endpoints that modify user data or log workouts are protected.

Auth endpoints:
- POST /api/auth/register  - body: { name?, email, password } -> returns { token, user }
- POST /api/auth/login     - body: { email, password } -> returns { token, user }

Use Authorization: Bearer <token> header or set cookie `token` for protected endpoints.

---

## POST /api/recipes/generate
Request JSON:
{
  "ingredients": ["tomato","rice"] or "tomato, rice",
  "user": { "allergies": ["nuts"], "goal": "weight loss" }
}
Response: JSON from AI service. Example shape expected: { title, ingredients[], steps[], nutrition: {calories, protein, carbs, fat} }

---

## POST /api/workouts/log (protected)
Request JSON:
{
  "userId": "<userId>",
  "type": "Strength",
  "durationMin": 45,
  "calories": 350,
  "date": "2025-10-07T...",
  "details": {}
}
Response: saved workout object

## GET /api/workouts/user/:userId
Return: array of workout objects

---

## GET /api/profile/:userId
Return: user profile (without passwordHash)

## POST /api/profile/:userId (protected)
Body: partial user fields to update (name, allergies, diet, goal)
Return: updated profile

---

## Goals
POST /api/goals
GET /api/goals/user/:userId

Body for POST:
{ userId, title, target, unit, progress }

*** End
