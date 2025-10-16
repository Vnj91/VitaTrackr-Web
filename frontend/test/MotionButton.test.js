const MotionButton = require('../../frontend/components/MotionButton')

test('MotionButton is a function or component', () => {
  expect(typeof MotionButton === 'function' || typeof MotionButton === 'object').toBeTruthy()
})
