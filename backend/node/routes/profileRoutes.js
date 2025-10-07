const express = require('express')
const router = express.Router()
const User = require('../models/User')

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

// Update profile
const auth = require('../middleware/authMiddleware')

// Update profile (protected)
router.post('/:userId', auth, async (req, res) => {
  try {
    const updates = req.body
    delete updates.passwordHash
    const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true }).select('-passwordHash')
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
