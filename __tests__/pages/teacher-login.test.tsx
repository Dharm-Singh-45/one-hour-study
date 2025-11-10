import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TeacherLogin from '../../pages/teacher-login'
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
    title: 'Teacher Login',
    description: 'Login page',
    keywords: 'login',
    alternates: { canonical: 'https://example.com/teacher-login' },
  })),
}))

describe('TeacherLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(utils.isValidEmail as jest.Mock).mockReturnValue(true)
  })

  it('should render login form', () => {
    render(<TeacherLogin />)
    expect(screen.getAllByText('Teacher Login').length).toBeGreaterThan(0)
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('should show validation error for invalid email', async () => {
    ;(utils.isValidEmail as jest.Mock).mockReturnValue(false)
    
    const { container } = render(<TeacherLogin />)
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

  it('should call loginUser with teacher type', async () => {
    ;(utils.loginUser as jest.Mock).mockReturnValue({
      success: true,
      message: 'Login successful!',
      user: { id: '1', email: 'test@example.com', type: 'teacher' },
    })

    render(<TeacherLogin />)
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(utils.loginUser).toHaveBeenCalledWith('test@example.com', 'password123', 'teacher')
    })
  })

  it('should have link to teacher register page', () => {
    render(<TeacherLogin />)
    const registerLink = screen.getByText('Sign up here')
    expect(registerLink.closest('a')).toHaveAttribute('href', '/teacher-register')
  })

  it('should have link to student login page', () => {
    render(<TeacherLogin />)
    const studentLoginLink = screen.getByText('Student Login')
    expect(studentLoginLink.closest('a')).toHaveAttribute('href', '/student-login')
  })
})

