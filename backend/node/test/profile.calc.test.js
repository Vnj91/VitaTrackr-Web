const request = require('supertest')
const { app, start } = require('../server')
const mongoose = require('mongoose')

let server
beforeAll(async ()=>{
  server = await start()
})

afterAll(async ()=>{
  await mongoose.connection.close()
  server && server.close()
})

describe('BMI calc endpoint', ()=>{
  test('returns bmi and requiredCalories', async ()=>{
    const res = await request(app)
      .post('/api/profile/000000000000000000000000/calc')
      .send({ heightCm: 170, weightKg: 70, age: 30, sex: 'male', activityFactor: 1.2 })
    expect(res.statusCode).toBe(200)
    expect(res.body.bmi).toBeDefined()
    expect(res.body.requiredCalories).toBeDefined()
  })
})
