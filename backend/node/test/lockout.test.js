const request = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let mongod
let app

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  process.env.MONGO_URI = uri
  await mongoose.connect(uri)
  app = require('../server')
})

afterAll(async () => {
  await mongoose.disconnect()
  if (mongod) await mongod.stop()
})

describe('Account lockout', () => {
  it('locks after failed attempts and unlocks via debug endpoint', async () => {
    const email = `locktest+${Date.now()}@example.com`
    // register
    const reg = await request(app).post('/api/auth/register').send({ email, password: 'password123', name: 'LockTester' })
    expect(reg.statusCode).toBe(200)

    // fail login 5 times
    for (let i = 0; i < 5; i++) {
      const r = await request(app).post('/api/auth/login').send({ email, password: 'wrongpassword' })
      expect(r.statusCode).toBe(400)
    }

    // next attempt should be 423 locked
    const locked = await request(app).post('/api/auth/login').send({ email, password: 'wrongpassword' })
    expect(locked.statusCode).toBe(423)

    // unlock via debug
    const u = await request(app).post('/api/debug/unlock-user').send({ email })
    expect(u.statusCode).toBe(200)

    // login with correct password should succeed
    const ok = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(ok.statusCode).toBe(200)
  })
})
