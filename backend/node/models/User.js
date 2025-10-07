const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  allergies: [String],
  diet: String,
  goal: String,
  refreshTokens: [{ tokenHash: String, createdAt: Date }],
  failedAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
