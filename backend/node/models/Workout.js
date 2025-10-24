const mongoose = require('mongoose')

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  durationMin: Number,
  calories: Number,
  date: { type: Date, default: Date.now },
  details: Object
  // consider adding mealTime or manual targetCalories in future
})

module.exports = mongoose.model('Workout', WorkoutSchema)
