const mongoose = require('mongoose')

const RecipeSuggestion = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  ingredients: [String],
  steps: [String],
  nutrition: { calories: Number, protein: Number, carbs: Number, fat: Number },
  targetCalories: Number,
  mealTime: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('RecipeSuggestion', RecipeSuggestion)
