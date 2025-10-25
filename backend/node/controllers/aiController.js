const hfService = require('../services/openaiService');
const RecipeSuggestion = require('../models/RecipeSuggestion');

exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients, user, targetCalories, mealTime } = req.body;
    if (!ingredients) return res.status(400).json({ error: 'ingredients required' });

    const prompt = `User Ingredients: ${Array.isArray(ingredients) ? ingredients.join(', ') : ingredients}\nAllergies: ${user?.allergies || 'none'}\nGoal: ${user?.goal || 'general'}\nTargetCalories: ${targetCalories || 'any'}\nMealTime: ${mealTime || 'any'}\n\nGenerate a healthy recipe that aims to hit TargetCalories for the meal time. Provide steps, cooking time, and nutrition info. Respond in JSON with title, ingredients[], steps[], nutrition{calories,protein,carbs,fat}`;

    // prefer OpenAI when configured, fall back to Hugging Face
    let aiResponse = null
    if (process.env.OPENAI_API_KEY) {
      aiResponse = await hfService.callOpenAI(prompt)
    } else {
      aiResponse = await hfService.callHuggingFace(prompt);
    }

    // try to normalize AI response: prefer structured object when possible
    let normalized = aiResponse
    try {
      if (aiResponse && aiResponse.raw && typeof aiResponse.raw === 'string') {
        // try parsing raw as JSON, else attempt to extract JSON substring
        try { normalized = JSON.parse(aiResponse.raw) } catch (e) {
          const m = aiResponse.raw.match(/(\{[\s\S]*\})/)
          if (m) {
            try { normalized = JSON.parse(m[1]) } catch (e2) { /* leave as-is */ }
          }
        }
      }
    } catch (e) { /* ignore */ }

    // if possible, store a suggestion linked to the user using normalized fields
    try {
      let suggestion = {
        userId: user?.id,
        title: normalized?.title || aiResponse?.title || 'Suggested Recipe',
        ingredients: normalized?.ingredients || aiResponse?.ingredients || [],
        steps: normalized?.steps || aiResponse?.steps || [],
        nutrition: normalized?.nutrition || aiResponse?.nutrition || {},
        targetCalories: targetCalories || (normalized?.nutrition?.calories || aiResponse?.nutrition?.calories || null),
        mealTime: mealTime || null
      }
      // save if user exists
      if (user?.id) {
        await RecipeSuggestion.create(suggestion)
      }
    } catch (e) { console.error('failed to save suggestion', e) }

    return res.json({ ai: normalized });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};

exports.listSuggestions = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) return res.status(400).json({ error: 'userId required' })
    const list = await RecipeSuggestion.find({ userId }).sort({ createdAt: -1 }).limit(50)
    res.json(list)
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }) }
}
