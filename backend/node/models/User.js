const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  allergies: [String],
  diet: String,
  goal: String,
  // new fields for calorie tracking and BMI
  heightCm: Number,
  weightKg: Number,
  age: Number,
  sex: { type: String, enum: ['male','female','other'], default: 'male' },
  bmi: Number,
  requiredCalories: Number,
  // optional per-meal targets (e.g., { breakfast: 500, lunch: 700 })
  mealTargets: { type: Map, of: Number },
  // per-user custom ingredients (strings)
  customIngredients: [{ type: String }],
  // program subscription map, keys are program ids -> bool
  programSubs: { type: Map, of: Boolean },
  // dashboard card order stored as array of strings
  dashboardOrder: [{ type: String }],
  // lightweight recent meals stored per-user
  recentMeals: [{ title: String, portions: Number, createdAt: Date }],
  favoriteRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecipeSuggestion' }],
  refreshTokens: [{ tokenHash: String, createdAt: Date }],
  failedAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
