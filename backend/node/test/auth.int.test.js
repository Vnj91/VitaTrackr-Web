let mongoose
let MongoMemoryServer
try {
  mongoose = require('mongoose')
  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
} catch (err) {
  // dev deps not installed; skip integration test
  console.warn('mongodb-memory-server not installed; auth.int.test will be skipped in this environment')
  module.exports = {}
  return
}

const request = require('supertest')
const { app, start } = require('../server')
const User = require('../models/User')

describe('auth integration (memory mongo)', () => {
  let mongod, server
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri)
    server = await start()
  })
  afterAll(async () => {
    if (server && server.close) server.close()
    await mongoose.disconnect()
    if (mongod) await mongod.stop()
  })

  test('register and login', async () => {
    const payload = { name: 'Test', email: 'test@example.com', password: 'password123' }
    const r1 = await request(app).post('/api/auth/register').send(payload)
    expect(r1.statusCode).toBe(200)
    expect(r1.body.user).toBeDefined()

    const r2 = await request(app).post('/api/auth/login').send({ email: payload.email, password: payload.password })
    expect(r2.statusCode).toBe(200)
    expect(r2.body.token).toBeDefined()
  })
})
