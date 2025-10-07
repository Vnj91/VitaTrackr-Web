const mongoose = require('mongoose')

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  durationMin: Number,
  calories: Number,
  date: { type: Date, default: Date.now },
  details: Object
})

module.exports = mongoose.model('Workout', WorkoutSchema)
