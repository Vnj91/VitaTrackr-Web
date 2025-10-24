const express = require('express')
const router = express.Router()
const Meal = require('../models/Meal')
const authMiddleware = require('../middleware/authMiddleware')

// Create a meal (requires auth)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, ingredients, nutrition } = req.body
    const meal = new Meal({ userId: req.user.id, title, ingredients, nutrition })
    await meal.save()
    res.status(201).json(meal)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create meal', details: err.message })
  }
})

// List meals for the authenticated user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    if (String(req.user.id) !== String(req.params.userId)) return res.status(403).json({ error: 'forbidden' })
    const meals = await Meal.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(200)
    res.json(meals)
  } catch (err) {
    res.status(500).json({ error: 'Failed to list meals', details: err.message })
  }
})

module.exports = router
