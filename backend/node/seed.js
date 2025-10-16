require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Workout = require('./models/Workout')

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vitatrack'

async function seed() {
  await mongoose.connect(MONGO)

  // create a sample user if not exists
  let user = await User.findOne({ email: 'tanishq@example.com' })
  const logger = require('./lib/logger')
  if (!user) {
    user = await User.create({ name: 'Tanishq', email: 'tanishq@example.com', allergies: ['nuts'], diet: 'vegan', goal: 'muscle gain' })
    logger.info('created sample user')
  } else {
    logger.info('sample user already exists')
  }

  // create sample workouts only if none exist for this user on today's date
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const existing = await Workout.findOne({ userId: user._id, date: { $gte: startOfDay } })
  if (!existing) {
    await Workout.create({ userId: user._id, type: 'Strength', durationMin: 45, calories: 350, date: new Date() })
    await Workout.create({ userId: user._id, type: 'Cardio', durationMin: 30, calories: 300, date: new Date() })
    logger.info('created sample workouts')
  } else {
    logger.info('sample workouts already present for today')
  }

  logger.info('seed complete')
  process.exit(0)
}

seed().catch(err=>{ console.error(err); process.exit(1) })
