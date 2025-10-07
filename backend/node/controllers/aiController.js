const openaiService = require('../services/openaiService')

exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients, user } = req.body
    if (!ingredients) return res.status(400).json({ error: 'ingredients required' })

    const prompt = `User Ingredients: ${Array.isArray(ingredients) ? ingredients.join(', ') : ingredients}\nAllergies: ${user?.allergies || 'none'}\nGoal: ${user?.goal || 'general'}\n\nGenerate a healthy recipe with steps, cooking time, and nutrition info. Avoid restricted ingredients and substitute if necessary. Respond in JSON with title, ingredients[], steps[], nutrition{calories,protein,carbs,fat}`

    const aiResponse = await openaiService.callOpenAI(prompt)

    return res.json({ ai: aiResponse })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
}
