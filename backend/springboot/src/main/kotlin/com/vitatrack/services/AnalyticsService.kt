package com.vitatrack.services

import com.vitatrack.repositories.WorkoutRepository
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit

@Service
class AnalyticsService(private val workoutRepository: WorkoutRepository) {
    fun computeWeeklyAverages(userId: String): Map<String, Any> {
        // naive calculation: get workouts in last 30 days and average
        val all = workoutRepository.findByUserId(userId)
        val now = Instant.now()
        val last30 = all.filter { it.date != null && it.date.toInstant().isAfter(now.minus(30, ChronoUnit.DAYS)) }
        val totalCalories = last30.mapNotNull { it.calories }.sum()
        val avg = if (last30.isEmpty()) 0 else totalCalories / last30.size
        return mapOf("weeklyAverageCalories" to avg, "workoutCountLast30Days" to last30.size)
    }
}
