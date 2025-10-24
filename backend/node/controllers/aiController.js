const hfService = require('../services/openaiService');
const RecipeSuggestion = require('../models/RecipeSuggestion');

exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients, user, targetCalories, mealTime } = req.body;
    if (!ingredients) return res.status(400).json({ error: 'ingredients required' });

    const prompt = `User Ingredients: ${Array.isArray(ingredients) ? ingredients.join(', ') : ingredients}\nAllergies: ${user?.allergies || 'none'}\nGoal: ${user?.goal || 'general'}\nTargetCalories: ${targetCalories || 'any'}\nMealTime: ${mealTime || 'any'}\n\nGenerate a healthy recipe that aims to hit TargetCalories for the meal time. Provide steps, cooking time, and nutrition info. Respond in JSON with title, ingredients[], steps[], nutrition{calories,protein,carbs,fat}`;

    const aiResponse = await hfService.callHuggingFace(prompt);

    // if possible, store a suggestion linked to the user
    try {
      const parsed = aiResponse?.raw ? aiResponse.raw : JSON.stringify(aiResponse)
      let suggestion = {
        userId: user?.id,
        title: aiResponse?.title || aiResponse?.raw?.title || 'Suggested Recipe',
        ingredients: aiResponse?.ingredients || [],
        steps: aiResponse?.steps || [],
        nutrition: aiResponse?.nutrition || {},
        targetCalories: targetCalories || (aiResponse?.nutrition?.calories || null),
        mealTime: mealTime || null
      }
      // save if user exists
      if (user?.id) {
        await RecipeSuggestion.create(suggestion)
      }
    } catch (e) { console.error('failed to save suggestion', e) }

    return res.json({ ai: aiResponse });
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
