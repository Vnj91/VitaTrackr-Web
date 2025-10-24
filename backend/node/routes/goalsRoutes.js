const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  target: Number,
  unit: String,
  progress: Number,
  createdAt: { type: Date, default: Date.now }
})

const Goal = mongoose.model('Goal', GoalSchema)

// Create a goal
router.post('/', async (req, res) => {
  try {
    const g = await Goal.create(req.body)
    res.json(g)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// Get goals for user
router.get('/user/:userId', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId })
    res.json(goals)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// Adjust progress for a goal
router.post('/:id/progress', async (req, res) => {
  try {
    const { delta } = req.body
    const goal = await Goal.findById(req.params.id)
    if (!goal) return res.status(404).json({ error: 'not found' })
    goal.progress = (goal.progress || 0) + (Number(delta) || 0)
    await goal.save()
    res.json(goal)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
