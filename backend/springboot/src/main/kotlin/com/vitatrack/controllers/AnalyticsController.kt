package com.vitatrack.controllers

import com.vitatrack.services.AnalyticsService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class AnalyticsController(private val analyticsService: AnalyticsService) {

    @GetMapping("/analytics/workouts/{userId}")
    fun workoutSummary(@PathVariable userId: String): Map<String, Any> {
        return analyticsService.computeWeeklyAverages(userId).plus("userId" to userId)
    }
}
