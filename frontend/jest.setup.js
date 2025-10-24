import '@testing-library/jest-dom'

// simple polyfills if needed
if (typeof window.scrollTo !== 'function') window.scrollTo = () => {}

// Provide a minimal mock for next/navigation's useRouter in the Jest environment
jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: () => {} })
}))
