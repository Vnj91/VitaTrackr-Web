const express = require('express')
const router = express.Router()
const aiController = require('../controllers/aiController')
const cache = require('../middleware/cache')
const authMiddleware = require('../middleware/authMiddleware')
const User = require('../models/User')

router.post('/generate', aiController.generateRecipe)
router.get('/suggestions/:userId', aiController.listSuggestions)

// Dev sample recipe (no OpenAI call)
router.get('/sample', cache(300), (req, res) => {
	res.json({
		title: 'Quick Veggie Stir Fry',
		servings: 2,
		ingredients: ['1 cup rice', '200g tofu', '1 bell pepper', '2 cups broccoli', '2 tbsp soy sauce'],
		steps: ['Cook rice', 'Stir-fry tofu and veggies', 'Add sauce and serve'],
		caloriesPerServing: 420
	})
})

// Toggle favorite for a recipe suggestion (requires auth)
router.post('/:id/favorite', authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
		if (!user) return res.status(404).json({ error: 'User not found' })
		const id = req.params.id
		const idx = (user.favoriteRecipes || []).findIndex(r => String(r) === String(id))
		if (idx >= 0) {
			// remove
			user.favoriteRecipes.splice(idx, 1)
		} else {
			user.favoriteRecipes = user.favoriteRecipes || []
			user.favoriteRecipes.push(id)
		}
		await user.save()
		res.json({ favorites: user.favoriteRecipes })
	} catch (err) {
		res.status(500).json({ error: 'Failed to toggle favorite', details: err.message })
	}
})

module.exports = router
