import React from 'react'
import { render, screen } from '@testing-library/react'
import Navbar from '../components/Navbar'

test('Navbar renders brand and links', () => {
  render(<Navbar />)
  expect(screen.getByText(/VitaTrack/i)).toBeInTheDocument()
})
