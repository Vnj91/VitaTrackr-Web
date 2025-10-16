const express = require('express')
const router = express.Router()
const aiController = require('../controllers/aiController')
const cache = require('../middleware/cache')

router.post('/generate', aiController.generateRecipe)

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

module.exports = router
