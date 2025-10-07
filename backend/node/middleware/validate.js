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
