const express = require('express')
const router = express.Router()
const Workout = require('../models/Workout')

const validate = require('../middleware/validate')

const auth = require('../middleware/authMiddleware')

// Log a workout (protected)
router.post('/log', auth, validate({ required: ['userId', 'type'] }), async (req, res) => {
  try {
    const { userId, type, durationMin, calories, date, details } = req.body
    if (!userId || !type) return res.status(400).json({ error: 'userId and type required' })
    const w = await Workout.create({ userId, type, durationMin, calories, date, details })
    res.json(w)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// Get workouts for a user (simple)
router.get('/user/:userId', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({ date: -1 }).limit(200)
    // also compute daily aggregate calories (by ISO date)
    const daily = {}
    workouts.forEach(w=>{
      const d = new Date(w.date).toISOString().slice(0,10)
      daily[d] = (daily[d]||0) + (w.calories||0)
    })
    const series = Object.keys(daily).sort().map(d=> ({ date: d, calories: daily[d] }))
    res.json({ workouts, dailySeries: series })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// Public sample workouts - useful for front-end demos (no auth)
router.get('/sample', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 }).limit(10)
    // If DB empty, return a static sample
    if (!workouts || workouts.length === 0) {
      return res.json([
        { date: new Date(), type: 'Cardio', durationMin: 30, calories: 300 },
        { date: new Date(), type: 'Strength', durationMin: 45, calories: 350 }
      ])
    }
    res.json(workouts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// Clone a workout: POST /api/workouts/:id/clone
router.post('/:id/clone', auth, async (req, res) => {
  try {
    const orig = await Workout.findById(req.params.id)
    if (!orig) return res.status(404).json({ error: 'Workout not found' })
    const copy = new Workout({
      userId: req.user.id,
      type: orig.type,
      durationMin: orig.durationMin,
      calories: orig.calories,
      date: new Date().toISOString(),
      details: orig.details
    })
    await copy.save()
    res.status(201).json(copy)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

module.exports = router

