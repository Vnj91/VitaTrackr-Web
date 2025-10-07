require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Workout = require('./models/Workout')

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vitatrack'

async function seed() {
  await mongoose.connect(MONGO)
  await User.deleteMany({})
  await Workout.deleteMany({})

  const user = await User.create({ name: 'Tanishq', email: 'tanishq@example.com', allergies: ['nuts'], diet: 'vegan', goal: 'muscle gain' })

  await Workout.create({ userId: user._id, type: 'Strength', durationMin: 45, calories: 350, date: new Date() })
  await Workout.create({ userId: user._id, type: 'Cardio', durationMin: 30, calories: 300, date: new Date() })

  console.log('seed complete')
  process.exit(0)
}

seed().catch(err=>{ console.error(err); process.exit(1) })
