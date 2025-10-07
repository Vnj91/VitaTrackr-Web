const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

module.exports = function(req, res, next) {
  try {
    const auth = req.headers.authorization || (req.cookies && req.cookies.token)
    if (!auth) return res.status(401).json({ error: 'unauthorized' })
    let token = auth
    if (auth.startsWith('Bearer ')) token = auth.slice(7)
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'unauthorized' })
  }
}
