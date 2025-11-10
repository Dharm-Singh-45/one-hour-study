import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  it('should render footer with copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2025 OneHourStudy. All rights reserved./)).toBeInTheDocument()
  })

  it('should render footer element', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('should have correct CSS classes', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('bg-gradient-to-br', 'from-slate-800', 'to-slate-900')
  })
})

