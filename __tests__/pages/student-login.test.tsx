import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import StudentLogin from '../../pages/student-login'
import * as utils from '@/lib/utils'

// Mock Next.js components
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>
  }
})

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

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

// Mock utils
jest.mock('@/lib/utils', () => ({
  isValidEmail: jest.fn(),
  loginUser: jest.fn(),
}))

jest.mock('@/lib/seo', () => ({
  generateMetadata: jest.fn(() => ({
    title: 'Student Login',
    description: 'Login page',
    keywords: 'login',
    alternates: { canonical: 'https://example.com/student-login' },
  })),
}))

describe('StudentLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(utils.isValidEmail as jest.Mock).mockReturnValue(true)
  })

  it('should render login form', () => {
    render(<StudentLogin />)
    expect(screen.getAllByText('Student Login').length).toBeGreaterThan(0)
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('should show validation error for invalid email', async () => {
    ;(utils.isValidEmail as jest.Mock).mockReturnValue(false)
    
    const { container } = render(<StudentLogin />)
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const form = container.querySelector('form')

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    if (form) {
      fireEvent.submit(form)
    } else {
      const submitButton = screen.getByRole('button', { name: /Sign In/i })
      fireEvent.click(submitButton)
    }

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('should show validation error for short password', async () => {
    render(<StudentLogin />)
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument()
    })
  })

  it('should clear errors when input changes', async () => {
    ;(utils.isValidEmail as jest.Mock).mockReturnValue(false)
    
    const { container } = render(<StudentLogin />)
    const emailInput = screen.getByLabelText(/Email Address/i)
    const form = container.querySelector('form')

    fireEvent.change(emailInput, { target: { value: 'invalid' } })
    
    if (form) {
      fireEvent.submit(form)
    } else {
      const submitButton = screen.getByRole('button', { name: /Sign In/i })
      fireEvent.click(submitButton)
    }

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    }, { timeout: 5000 })

    ;(utils.isValidEmail as jest.Mock).mockReturnValue(true)
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('should call loginUser on successful validation', async () => {
    ;(utils.loginUser as jest.Mock).mockReturnValue({
      success: true,
      message: 'Login successful!',
      user: { id: '1', email: 'test@example.com', type: 'student' },
    })

    render(<StudentLogin />)
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(utils.loginUser).toHaveBeenCalledWith('test@example.com', 'password123', 'student')
    })
  })

  it('should show error message on failed login', async () => {
    ;(utils.loginUser as jest.Mock).mockReturnValue({
      success: false,
      message: 'Invalid email or password',
    })

    render(<StudentLogin />)
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })
  })

  it('should show loading state during login', async () => {
    ;(utils.loginUser as jest.Mock).mockReturnValue({
      success: true,
      message: 'Login successful!',
      user: { id: '1', email: 'test@example.com', type: 'student' },
    })

    render(<StudentLogin />)
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Check for loading state immediately after click
    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('should have link to student register page', () => {
    render(<StudentLogin />)
    const registerLink = screen.getByText('Sign up here')
    expect(registerLink.closest('a')).toHaveAttribute('href', '/student-register')
  })

  it('should have link to teacher login page', () => {
    render(<StudentLogin />)
    const teacherLoginLink = screen.getByText('Teacher Login')
    expect(teacherLoginLink.closest('a')).toHaveAttribute('href', '/teacher-login')
  })
})

