const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const request = require('supertest')

let mongod
let server
const User = require('../models/User')

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  process.env.MONGO_URI = uri
  process.env.JWT_SECRET = 'test-secret'
  // start server (imports express app and connects to mongoose)
  const srv = require('../server')
  server = await srv.start()
  // ensure mongoose is using in-memory server
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
  if (server && server.close) await new Promise(r => server.close(r))
  await mongoose.disconnect()
  if (mongod) await mongod.stop()
})

test('profile endpoints persist ingredient, program sub, and lastmeal', async () => {
  // create user directly in DB
  const user = await User.create({ name: 'Test', email: 'test@example.com' })
  const token = jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET)

  // POST ingredient
  const ingRes = await request(server)
    .post('/api/profile/' + user._id + '/ingredient')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Ingredient' })
  expect(ingRes.status).toBe(201)
  expect(ingRes.body.customIngredients).toBeDefined()
  expect(ingRes.body.customIngredients[0]).toBe('Test Ingredient')

  // POST program subscribe
  const progRes = await request(server)
    .post('/api/profile/' + user._id + '/program')
    .set('Authorization', `Bearer ${token}`)
    .send({ id: 'prog1', subscribe: true })
  expect(progRes.status).toBe(200)
  expect(progRes.body.programSubs).toBeDefined()
  expect(progRes.body.programSubs.prog1).toBe(true)

  // POST lastmeal
  const mealRes = await request(server)
    .post('/api/profile/' + user._id + '/lastmeal')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Lunch', portions: 2 })
  expect(mealRes.status).toBe(201)
  expect(mealRes.body.recentMeals).toBeDefined()
  expect(mealRes.body.recentMeals[0].title).toBe('Lunch')

  // create a meal via /api/meals and then GET /api/meals/user/:userId
  const mealCreate = await request(server)
    .post('/api/meals')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'My Meal', ingredients: ['a','b'] })
  expect(mealCreate.status).toBe(201)

  const mealsList = await request(server)
    .get('/api/meals/user/' + user._id)
    .set('Authorization', `Bearer ${token}`)
  expect(mealsList.status).toBe(200)
  expect(Array.isArray(mealsList.body)).toBe(true)
  expect(mealsList.body[0].title).toBe('My Meal')
})
