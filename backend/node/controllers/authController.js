const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const crypto = require('crypto')

function hashToken(token){
  return crypto.createHash('sha256').update(token).digest('hex')
}

function createTokenPair(user){
  const accessToken = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
  const refresh = crypto.randomBytes(32).toString('hex')
  const refreshHash = hashToken(refresh)
  return { accessToken, refresh, refreshHash }
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, allergies, diet, goal } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })
    // basic validation
    if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'invalid email' })
    if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ error: 'password must be at least 6 characters' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'email exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash: hash, allergies, diet, goal })
  const { accessToken, refresh, refreshHash } = createTokenPair(user)
  // store hashed refresh token
  user.refreshTokens = user.refreshTokens || []
  user.refreshTokens.push({ tokenHash: refreshHash, createdAt: new Date() })
  await user.save()
  // set cookies
  res.cookie('token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * 7 })
  res.cookie('refreshToken', refresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * 30 })
  res.json({ token: accessToken, user: { id: user._id, name: user.name, email: user.email, allergies: user.allergies, diet: user.diet, goal: user.goal } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })
    if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'invalid input' })
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'invalid credentials' })
    // lockout check
    const now = Date.now()
    if (user.lockUntil && user.lockUntil > now) {
      return res.status(423).json({ error: 'account locked, try later' })
    }
    const ok = await bcrypt.compare(password, user.passwordHash || '')
    if (!ok) {
      // increment failed attempts
      user.failedAttempts = (user.failedAttempts || 0) + 1
      const MAX = 5
      if (user.failedAttempts >= MAX) {
        user.lockUntil = Date.now() + (15 * 60 * 1000) // 15 minutes
      }
      await user.save()
      return res.status(400).json({ error: 'invalid credentials' })
    }
    // success: reset counters
    user.failedAttempts = 0
    user.lockUntil = undefined
    await user.save()
  const { accessToken, refresh, refreshHash } = createTokenPair(user)
  user.refreshTokens = user.refreshTokens || []
  user.refreshTokens.push({ tokenHash: refreshHash, createdAt: new Date() })
  await user.save()
  res.cookie('token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * 7 })
  res.cookie('refreshToken', refresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * 30 })
  res.json({ token: accessToken, user: { id: user._id, name: user.name, email: user.email, allergies: user.allergies, diet: user.diet, goal: user.goal } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

// requestPasswordReset: generate a token and save to user record. In production you'd email this.
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'email required' })
    const user = await User.findOne({ email })
    if (!user) return res.status(200).json({ ok: true }) // don't reveal user existence in prod
    const token = crypto.randomBytes(20).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    user.resetToken = tokenHash
    user.resetExpires = Date.now() + 1000 * 60 * 60 // 1 hour
    await user.save()
    // In dev, return the token so testers can use it without email
    return res.json({ ok: true, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

// resetPassword: validate token and set new password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body
    if (!token || !newPassword) return res.status(400).json({ error: 'token and newPassword required' })
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ resetToken: tokenHash, resetExpires: { $gt: Date.now() } })
    if (!user) return res.status(400).json({ error: 'invalid or expired token' })
    const hash = await bcrypt.hash(newPassword, 10)
    user.passwordHash = hash
    user.resetToken = undefined
    user.resetExpires = undefined
    await user.save()
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

exports.refreshToken = async (req, res) => {
  try {
    const refresh = req.cookies && req.cookies.refreshToken
    if (!refresh) return res.status(401).json({ error: 'no refresh token' })
    const rh = hashToken(refresh)
    const user = await User.findOne({ 'refreshTokens.tokenHash': rh })
    if (!user) return res.status(401).json({ error: 'invalid refresh token' })
    // rotate: remove the used refresh token entry
    user.refreshTokens = (user.refreshTokens || []).filter(rt => rt.tokenHash !== rh)
    const { accessToken, refresh: newRefresh, refreshHash: newRefreshHash } = createTokenPair(user)
    user.refreshTokens.push({ tokenHash: newRefreshHash, createdAt: new Date() })
    await user.save()
    res.cookie('token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * 7 })
    res.cookie('refreshToken', newRefresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * 30 })
    return res.json({ ok: true, token: accessToken, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

// revoke refresh token (logout refresh)
exports.revokeRefresh = async (req, res) => {
  try {
    const refresh = req.cookies && req.cookies.refreshToken
    if (!refresh) return res.json({ ok: true })
    const rh = hashToken(refresh)
    const user = await User.findOne({ 'refreshTokens.tokenHash': rh })
    if (!user) return res.json({ ok: true })
    user.refreshTokens = (user.refreshTokens || []).filter(rt => rt.tokenHash !== rh)
    await user.save()
    res.clearCookie('refreshToken')
    res.clearCookie('token')
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}
