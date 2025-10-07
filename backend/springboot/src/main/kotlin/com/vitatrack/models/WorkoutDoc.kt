package com.vitatrack.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "workouts")
data class WorkoutDoc(
    @Id
    val id: String? = null,
    val userId: String,
    val type: String,
    val durationMin: Int? = null,
    val calories: Int? = null,
    val date: Date? = null,
    val details: Map<String, Any>? = null
)
