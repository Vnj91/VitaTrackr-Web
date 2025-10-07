# VitaTrack Spring Boot Service

This is a minimal Spring Boot Kotlin service skeleton for analytics. Build with Gradle:

./gradlew bootRun

It exposes a test endpoint: GET /analytics/workouts/{userId}

This service uses Spring Data MongoDB. Configure `MONGO_URI` (or edit `application.properties`).

Endpoints:
- GET /analytics/workouts/{userId} -> { weeklyAverageCalories, workoutCountLast30Days }
