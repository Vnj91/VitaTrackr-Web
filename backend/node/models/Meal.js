const mongoose = require('mongoose')

const MealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  ingredients: [String],
  nutrition: Object,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Meal', MealSchema)
