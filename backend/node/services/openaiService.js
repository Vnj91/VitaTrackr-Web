const axios = require('axios');

const HF_API_KEY = process.env.HF_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

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

// OpenAI (Chat Completions) wrapper — used when OPENAI_API_KEY is set
exports.callOpenAI = async (prompt) => {
  if (!OPENAI_API_KEY) {
    return { error: 'OpenAI key not configured (set OPENAI_API_KEY in .env)' };
  }
  try {
    const resp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that responds with JSON when asked.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 900
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    const choices = resp.data?.choices || []
    const text = (choices[0] && (choices[0].message?.content || choices[0].text)) || ''
    try {
      const json = JSON.parse(text)
      return json
    } catch (e) {
      return { raw: text }
    }
  } catch (err) {
    console.error('OpenAI error', err?.response?.data || err.message)
    return { error: 'openai request failed', details: err?.response?.data || err.message }
  }
}
