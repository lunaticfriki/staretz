// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from '../app'

function navigateTo(path: string) {
  window.history.pushState({}, '', path)
}

afterEach(() => {
  cleanup()
})

describe('App', () => {
  it('renders the header menu and footer with the current year on the home page', async () => {
    navigateTo('/')
    render(<App />)

    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'About' })).toBeTruthy()
    expect(screen.getByText(`Staretz, ${new Date().getFullYear()}`)).toBeTruthy()
  })

  it('shows the 5 most recent posts on the home page, most recent first', async () => {
    navigateTo('/')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Shipping Fast Without Breaking Architecture')).toBeTruthy()
    })

    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings).toHaveLength(5)
    expect(headings[0].textContent).toBe('Shipping Fast Without Breaking Architecture')
  })

  it('navigates to the about page', async () => {
    navigateTo('/')
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: 'About' }))

    await waitFor(() => {
      expect(screen.getByText('About Staretz')).toBeTruthy()
    })
  })

  it('navigates from a post preview to the full post at its slug route', async () => {
    navigateTo('/')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Shipping Fast Without Breaking Architecture')).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('link', { name: /Shipping Fast Without Breaking Architecture/ }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Shipping Fast Without Breaking Architecture' })).toBeTruthy()
    })
    expect(screen.getByText('Why this matters')).toBeTruthy()
  })

  it('shows a not-found message for an unknown slug', async () => {
    navigateTo('/blog/does-not-exist')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Post not found')).toBeTruthy()
    })
  })
})
