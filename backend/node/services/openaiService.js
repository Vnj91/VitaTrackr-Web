const axios = require('axios')

const OPENAI_KEY = process.env.OPENAI_API_KEY || ''

exports.callOpenAI = async (prompt) => {
  if (!OPENAI_KEY) {
    return { error: 'OpenAI key not configured (set OPENAI_API_KEY in .env)' }
  }

  // Simple completion using OpenAI Chat Completions endpoint
  try {
    const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const text = resp.data?.choices?.[0]?.message?.content
    // attempt to parse JSON from the assistant
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
