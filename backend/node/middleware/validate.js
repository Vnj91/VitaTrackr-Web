// Basic request body validation middleware
module.exports = function (schema) {
  return (req, res, next) => {
    try {
      const body = req.body || {}
      for (const [key, rule] of Object.entries(schema)) {
        const val = body[key]
        if (rule.required && (val === undefined || val === null || val === '')) {
          return res.status(400).json({ error: `${key} is required` })
        }
        if (rule.type && val != null) {
          const t = typeof val
          if (t !== rule.type) return res.status(400).json({ error: `${key} must be ${rule.type}` })
        }
        if (rule.regex && typeof val === 'string' && !rule.regex.test(val)) {
          return res.status(400).json({ error: `${key} is invalid` })
        }
        if (rule.minLength && typeof val === 'string' && val.length < rule.minLength) {
          return res.status(400).json({ error: `${key} must be at least ${rule.minLength} characters` })
        }
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}
module.exports = function validate(schema) {
  return (req, res, next) => {
    // very small validation placeholder - schema is an object with required array
    try {
      if (schema && Array.isArray(schema.required)) {
        for (const key of schema.required) {
          if (req.body[key] === undefined) return res.status(400).json({ error: `missing ${key}` })
        }
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}
