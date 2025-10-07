require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const aiRoutes = require('./routes/aiRoutes')
const workoutRoutes = require('./routes/workoutRoutes')
const profileRoutes = require('./routes/profileRoutes')
const goalsRoutes = require('./routes/goalsRoutes')
const authRoutes = require('./routes/authRoutes')
const authMiddleware = require('./middleware/authMiddleware')
const rateLimit = require('./middleware/rateLimit')
const debugRoutes = require('./routes/debugRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const healthRoutes = require('./routes/healthRoutes')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))

app.use('/api/recipes', rateLimit, aiRoutes)
app.use('/api/workouts', workoutRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/goals', goalsRoutes)
app.use('/api/auth', rateLimit, authRoutes)

// Development debug routes
app.use('/api/debug', debugRoutes)

// Analytics proxy (forwards to Spring Boot or returns mock)
app.use('/api/analytics', analyticsRoutes)

// Health endpoint for monitoring
app.use('/api', healthRoutes)

// simple protected test endpoint
app.get('/api/me', authMiddleware, async (req, res) => {
  res.json({ userId: req.user.id, email: req.user.email })
})

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vitatrack'
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  console.log('Connected to MongoDB')
}).catch(err=>console.error('Mongo connection error', err))

const port = process.env.PORT || 5001
if (require.main === module) {
  app.listen(port, ()=>console.log(`Node AI server running on ${port}`))
}

module.exports = app
