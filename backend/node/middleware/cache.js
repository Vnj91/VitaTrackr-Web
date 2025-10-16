// Simple Cache-Control middleware for GET responses
module.exports = function (seconds = 60) {
  return (req, res, next) => {
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${seconds}`)
    }
    next()
  }
}
