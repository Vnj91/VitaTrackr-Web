const express = require('express')
const axios = require('axios')

const router = express.Router()

// Proxy analytics requests to Spring Boot service if available,
// otherwise return a mock analytics response for development.
router.get('/proxy/workouts/:userId', async (req, res) => {
  const userId = req.params.userId
  const springUrl = process.env.SPRINGBOOT_URL || 'http://localhost:8080'

  try {
    const resp = await axios.get(`${springUrl}/analytics/workouts/${encodeURIComponent(userId)}`, { timeout: 2500 })
    return res.json({ source: 'spring', data: resp.data })
  } catch (err) {
    // On any error, return mock analytics that mirrors expected shape
    const now = new Date()
    // generate last 7 days series
    const series = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      series.push({ date: d.toISOString(), calories: Math.round(300 + Math.random() * 200) })
    }

    const avg = Math.round(series.reduce((s, it) => s + it.calories, 0) / series.length)
    const mock = {
      weeklyAverageCalories: avg,
      workoutCountLast30Days: 8,
      weeklySeries: series,
      generatedAt: now.toISOString(),
      note: 'mock analytics - Spring Boot unreachable'
    }
    return res.json({ source: 'mock', data: mock })
  }
})

module.exports = router
