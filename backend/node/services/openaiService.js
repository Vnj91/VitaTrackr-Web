const axios = require('axios');

const HF_API_KEY = process.env.HF_API_KEY || '';

exports.callHuggingFace = async (prompt) => {
  if (!HF_API_KEY) {
    return { error: 'Hugging Face key not configured (set HF_API_KEY in .env)' };
  }

  // Hugging Face Inference API (text-generation)
  try {
    const resp = await axios.post(
      'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const text = resp.data?.[0]?.generated_text || resp.data?.generated_text || '';
    try {
      const json = JSON.parse(text);
      return json;
    } catch (e) {
      return { raw: text };
    }
  } catch (err) {
    console.error('Hugging Face error', err?.response?.data || err.message);
    return { error: 'huggingface request failed', details: err?.response?.data || err.message };
  }
};
