const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authRateLimit = require('../middleware/authRateLimit')

router.post('/register', authRateLimit, authController.register)
router.post('/login', authRateLimit, authController.login)
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
