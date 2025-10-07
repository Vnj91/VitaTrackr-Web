const request = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let mongod
let app

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  process.env.MONGO_URI = uri
  // ensure mongoose uses the test uri
  await mongoose.connect(uri)
  // require app after setting MONGO_URI
  app = require('../server')
})

afterAll(async () => {
  if (app && app.close) try { app.close() } catch(e) {}
  await mongoose.disconnect()
  if (mongod) await mongod.stop()
})

describe('Auth routes', () => {
  it('register -> login flow', async () => {
    const email = `testuser+${Date.now()}@example.com`
    const reg = await request(app).post('/api/auth/register').send({ email, password: 'password123', name: 'Tester' })
    expect(reg.statusCode).toBe(200)
    expect(reg.body.user).toBeDefined()

    const login = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(login.statusCode).toBe(200)
    expect(login.body.user).toBeDefined()
  })

  it('rejects bad input', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'not-an-email', password: '123' })
    expect(res.statusCode).toBe(400)
  })
})
