import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Contact from '../../pages/contact'
import * as utils from '@/lib/utils'
import * as seo from '@/lib/seo'

// Mock Next.js components
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>
  }
})

// Mock components
jest.mock('@/components/Navbar', () => {
  return function Navbar() {
    return <nav>Navbar</nav>
  }
})

jest.mock('@/components/Footer', () => {
  return function Footer() {
    return <footer>Footer</footer>
  }
})

jest.mock('@/components/SuccessModal', () => {
  return function SuccessModal({ isOpen, onClose, title, message }: any) {
    if (!isOpen) return null
    return (
      <div data-testid="success-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    )
  }
})

// Mock utils
jest.mock('@/lib/utils', () => ({
  isValidEmail: jest.fn(),
  isValidPhone: jest.fn(),
  saveToLocalStorage: jest.fn(),
}))

// Mock SEO
jest.mock('@/lib/seo', () => ({
  generateMetadata: jest.fn(),
}))

describe('Contact', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(utils.isValidEmail as jest.Mock).mockReturnValue(true)
    ;(utils.isValidPhone as jest.Mock).mockReturnValue(true)
    ;(utils.saveToLocalStorage as jest.Mock).mockReturnValue(true)
    ;(seo.generateMetadata as jest.Mock).mockReturnValue({
      title: 'Contact - OneHourStudy',
      description: 'Test description',
      keywords: 'test, keywords',
      alternates: {
        canonical: 'https://onehourstudy.com/contact',
      },
      openGraph: {
        type: 'website',
        url: 'https://onehourstudy.com/contact',
        title: 'Contact - OneHourStudy',
        description: 'Test description',
        images: [{ url: 'https://onehourstudy.com/image.jpg' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Contact - OneHourStudy',
        description: 'Test description',
        images: ['https://onehourstudy.com/image.jpg'],
      },
    })
  })

  it('should render contact page', () => {
    render(<Contact />)
    expect(screen.getByText(/Get in Touch/i)).toBeInTheDocument()
  })

  it('should render contact form', () => {
    render(<Contact />)
    expect(screen.getAllByText(/Send us a Message/i).length).toBeGreaterThan(0)
  })

  it('should render all form fields', () => {
    const { container } = render(<Contact />)
    expect(container.querySelector('input[name="name"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="email"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="phone"]')).toBeInTheDocument()
    expect(container.querySelector('select[name="subject"]')).toBeInTheDocument()
    expect(container.querySelector('textarea[name="message"]')).toBeInTheDocument()
  })

  it('should show validation error for short name', async () => {
    const { container } = render(<Contact />)
    const form = container.querySelector('form')
    const nameInput = container.querySelector('input[name="name"]')

    if (nameInput && form) {
      fireEvent.change(nameInput, { target: { value: 'A' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters long')).toBeInTheDocument()
      }, { timeout: 5000 })
    }
  })

  it('should show validation error for invalid email', async () => {
    ;(utils.isValidEmail as jest.Mock).mockReturnValue(false)
    
    const { container } = render(<Contact />)
    const form = container.querySelector('form')
    const emailInput = container.querySelector('input[name="email"]')

    if (emailInput && form) {
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      }, { timeout: 5000 })
    }
  })

  it('should show validation error for invalid phone', async () => {
    ;(utils.isValidPhone as jest.Mock).mockReturnValue(false)
    
    const { container } = render(<Contact />)
    const form = container.querySelector('form')
    const phoneInput = container.querySelector('input[name="phone"]')

    if (phoneInput && form) {
      fireEvent.change(phoneInput, { target: { value: '123' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid phone number/i)).toBeInTheDocument()
      }, { timeout: 5000 })
    }
  })

  it('should show validation error when subject is not selected', async () => {
    const { container } = render(<Contact />)
    const form = container.querySelector('form')
    const nameInput = container.querySelector('input[name="name"]')
    const emailInput = container.querySelector('input[name="email"]')
    const messageInput = container.querySelector('textarea[name="message"]')

    if (nameInput && emailInput && messageInput && form) {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(messageInput, { target: { value: 'This is a test message' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Please select a subject')).toBeInTheDocument()
      }, { timeout: 5000 })
    }
  })

  it('should show validation error for short message', async () => {
    const { container } = render(<Contact />)
    const form = container.querySelector('form')
    const messageInput = container.querySelector('textarea[name="message"]')

    if (messageInput && form) {
      fireEvent.change(messageInput, { target: { value: 'Short' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Message must be at least 10 characters long')).toBeInTheDocument()
      }, { timeout: 5000 })
    }
  })

  it('should submit form successfully', async () => {
    const { container } = render(<Contact />)
    const form = container.querySelector('form')
    const nameInput = container.querySelector('input[name="name"]')
    const emailInput = container.querySelector('input[name="email"]')
    const subjectSelect = container.querySelector('select[name="subject"]')
    const messageInput = container.querySelector('textarea[name="message"]')

    if (nameInput && emailInput && subjectSelect && messageInput && form) {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(subjectSelect, { target: { value: 'general' } })
      fireEvent.change(messageInput, { target: { value: 'This is a test message' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(utils.saveToLocalStorage).toHaveBeenCalled()
        expect(screen.getByTestId('success-modal')).toBeInTheDocument()
      }, { timeout: 5000 })
    }
  })

  it('should render contact information', () => {
    render(<Contact />)
    expect(screen.getByText(/Contact Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Jodhpur, Rajasthan/i)).toBeInTheDocument()
  })

  it('should render Navbar and Footer', () => {
    render(<Contact />)
    expect(screen.getByText('Navbar')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})

