const express = require('express')
const axios = require('axios')
const mongoose = require('mongoose')

const router = express.Router()

// Health endpoint reports server uptime, mongo connection state and optional Spring Boot health
router.get('/health', async (req, res) => {
  const uptimeSec = Math.floor(process.uptime())
  const mongoState = mongoose.connection.readyState // 0 disconnected, 1 connected
  const mongoConnected = mongoState === 1

  const springUrl = process.env.SPRINGBOOT_URL || 'http://localhost:8080'
  let spring = { reachable: false }

  try {
    // try the actuator health first
    const r = await axios.get(`${springUrl.replace(/\/$/, '')}/actuator/health`, { timeout: 2000 })
    spring.reachable = true
    spring.status = r.data
  } catch (errA) {
    try {
      const r2 = await axios.get(`${springUrl.replace(/\/$/, '')}/health`, { timeout: 2000 })
      spring.reachable = true
      spring.status = r2.data
    } catch (errB) {
      spring.reachable = false
      spring.error = (errB && errB.message) || (errA && errA.message) || 'unreachable'
    }
  }

  res.json({
    server: 'ok',
    uptimeSec,
    mongo: { state: mongoState, connected: mongoConnected },
    spring
  })
})

module.exports = router
