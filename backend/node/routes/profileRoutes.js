const express = require('express')
const router = express.Router()
const User = require('../models/User')

// utility: calculate BMI and recommended calories (Mifflin-St Jeor approximation)
function calculateBmi(heightCm, weightKg) {
  if (!heightCm || !weightKg) return null
  const m = heightCm / 100
  return +(weightKg / (m*m)).toFixed(1)
}

function estimateCalories({ age, sex, heightCm, weightKg, activityFactor = 1.2 }) {
  if (!heightCm || !weightKg || !age) return null
  // Mifflin-St Jeor
  const s = (sex === 'female') ? -161 : 5
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s
  return Math.round(bmr * activityFactor)
}

// Get profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash')
    if (!user) return res.status(404).json({ error: 'not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// Export profile data (protected)
const auth = require('../middleware/authMiddleware')
router.get('/:userId/export', auth, async (req, res) => {
  try {
    if (String(req.user.id) !== String(req.params.userId)) return res.status(403).json({ error: 'forbidden' })
    const user = await User.findById(req.params.userId).select('-passwordHash')
    if (!user) return res.status(404).json({ error: 'not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// Update profile (protected)
router.post('/:userId', auth, async (req, res) => {
  try {
    const updates = req.body
    delete updates.passwordHash
    // if height/weight/age provided, recalc bmi and requiredCalories if requested
    if (updates.heightCm || updates.weightKg || updates.age) {
      const existing = await User.findById(req.params.userId)
      const height = updates.heightCm || existing.heightCm
      const weight = updates.weightKg || existing.weightKg
      const age = updates.age || existing.age
      const sex = updates.sex || existing.sex
      const bmi = calculateBmi(height, weight)
      updates.bmi = bmi
      // if client requested estimateCalories flag, compute requiredCalories
      if (updates.estimateCalories) {
        const rc = estimateCalories({ age, sex, heightCm: height, weightKg: weight })
        updates.requiredCalories = rc
      }
    }
    const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true }).select('-passwordHash')
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// Calculate BMI / estimate calories without saving
router.post('/:userId/calc', auth, async (req, res) => {
  try {
    const { heightCm, weightKg, age, sex, activityFactor } = req.body
    const bmi = calculateBmi(heightCm, weightKg)
    const requiredCalories = estimateCalories({ age, sex, heightCm, weightKg, activityFactor })
    res.json({ bmi, requiredCalories })
  } catch (e) { res.status(500).json({ error: 'server error' }) }
})

module.exports = router

// Additional profile helpers
// Add custom ingredient: POST /api/profile/:userId/ingredient
router.post('/:userId/ingredient', auth, async (req, res) => {
  try {
    if (String(req.user.id) !== String(req.params.userId)) return res.status(403).json({ error: 'forbidden' })
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'name required' })
    const user = await User.findById(req.params.userId)
    user.customIngredients = user.customIngredients || []
    user.customIngredients.unshift(name)
    // limit to 50
    user.customIngredients = user.customIngredients.slice(0,50)
    await user.save()
    res.status(201).json({ customIngredients: user.customIngredients })
  } catch (err) { console.error(err); res.status(500).json({ error: 'server error' }) }
})

// Toggle program subscription: POST /api/profile/:userId/program
router.post('/:userId/program', auth, async (req, res) => {
  try {
    if (String(req.user.id) !== String(req.params.userId)) return res.status(403).json({ error: 'forbidden' })
    const { id, subscribe } = req.body
    if (!id) return res.status(400).json({ error: 'id required' })
    const user = await User.findById(req.params.userId)
    user.programSubs = user.programSubs || {}
    user.programSubs.set(id, !!subscribe)
    await user.save()
    res.json({ programSubs: Object.fromEntries(user.programSubs || []) })
  } catch (err) { console.error(err); res.status(500).json({ error: 'server error' }) }
})

// Persist a lightweight recent meal: POST /api/profile/:userId/lastmeal
router.post('/:userId/lastmeal', auth, async (req, res) => {
  try {
    if (String(req.user.id) !== String(req.params.userId)) return res.status(403).json({ error: 'forbidden' })
    const { title, portions } = req.body
    if (!title) return res.status(400).json({ error: 'title required' })
    const user = await User.findById(req.params.userId)
    user.recentMeals = user.recentMeals || []
    user.recentMeals.unshift({ title, portions: portions || 1, createdAt: new Date() })
    user.recentMeals = user.recentMeals.slice(0, 20)
    await user.save()
    res.status(201).json({ recentMeals: user.recentMeals })
  } catch (err) { console.error(err); res.status(500).json({ error: 'server error' }) }
})
