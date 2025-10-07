package com.vitatrack.repositories

import com.vitatrack.models.WorkoutDoc
import org.springframework.data.mongodb.repository.MongoRepository

interface WorkoutRepository : MongoRepository<WorkoutDoc, String> {
    fun findByUserId(userId: String): List<WorkoutDoc>
}
