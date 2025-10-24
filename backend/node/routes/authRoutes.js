const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authRateLimit = require('../middleware/authRateLimit')
const validate = require('../middleware/validate')

router.post('/register', authRateLimit, validate({ email: { required: true, type: 'string', regex: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ }, password: { required: true, type: 'string', minLength: 6 } }), authController.register)
router.post('/login', authRateLimit, validate({ email: { required: true, type: 'string' }, password: { required: true, type: 'string' } }), authController.login)
router.post('/logout', (req, res) => {
	res.clearCookie('token')
	res.json({ ok: true })
})

// Password reset (dev stub): request and perform reset
router.post('/request-reset', authRateLimit, authController.requestPasswordReset)
router.post('/reset', authRateLimit, authController.resetPassword)
router.post('/refresh', authController.refreshToken)
router.post('/revoke', authController.revokeRefresh)

module.exports = router
