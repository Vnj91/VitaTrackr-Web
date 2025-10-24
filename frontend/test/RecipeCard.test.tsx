import React from 'react'
import { render } from '@testing-library/react'
import RecipeCard from '../components/RecipeCard'

test('RecipeCard shows loading skeleton when loading', () => {
  const { container } = render(<RecipeCard loading />)
  // loading state renders skeleton elements
  expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0)
})
