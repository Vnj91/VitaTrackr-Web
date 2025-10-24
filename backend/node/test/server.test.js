const request = require('supertest')
const app = require('../server')

describe('basic server', () => {
  it('GET /api returns 200', async () => {
    const res = await request(app).get('/api')
    expect(res.statusCode).toBeGreaterThanOrEqual(200)
  })
})
