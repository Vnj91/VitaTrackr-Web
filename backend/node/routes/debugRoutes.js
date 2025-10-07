const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Workout = require('../models/Workout')

// WARNING: Development-only endpoints. Remove in production.

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash')
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

router.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find().limit(500)
    res.json(workouts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// Dev helper: unlock a user by email or id
router.post('/unlock-user', async (req, res) => {
  try {
    const { email, userId } = req.body
    const q = email ? { email } : userId ? { _id: userId } : null
    if (!q) return res.status(400).json({ error: 'email or userId required' })
    const user = await User.findOne(q)
    if (!user) return res.status(404).json({ error: 'user not found' })
    user.failedAttempts = 0
    user.lockUntil = undefined
    await user.save()
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
