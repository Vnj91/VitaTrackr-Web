const rateLimit = require('express-rate-limit')

// Stricter rate limiting for auth endpoints to mitigate brute force
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})
