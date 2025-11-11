import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '../../pages/login'
import * as utils from '@/lib/utils'
import * as seo from '@/lib/seo'

// Mock Next.js components
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>
  }
})

jest.mock('next/link', () => {
  return function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
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
  focusFirstErrorField: jest.fn(),
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock SEO
jest.mock('@/lib/seo', () => ({
  generateMetadata: jest.fn(),
}))

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
    ;(utils.isValidEmail as jest.Mock).mockReturnValue(true)
    ;(utils.loginUser as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Login successful!',
      user: { id: '1', email: 'test@example.com', type: 'student' },
    })
    ;(seo.generateMetadata as jest.Mock).mockReturnValue({
      title: 'Login - OneHourStudy',
      description: 'Test description',
      keywords: 'test, keywords',
      alternates: {
        canonical: 'https://onehourstudy.com/login',
      },
    })
  })

  it('should render login page', () => {
    render(<Login />)
    expect(screen.getByText(/Login to OneHourStudy/i)).toBeInTheDocument()
  })

  it('should render user type selector', () => {
    render(<Login />)
    expect(screen.getByText('Student')).toBeInTheDocument()
    expect(screen.getByText('Teacher')).toBeInTheDocument()
  })

  it('should default to student type', () => {
    render(<Login />)
    const studentButton = screen.getByText('Student').closest('button')
    expect(studentButton).toHaveClass('bg-gradient-primary')
  })

  it('should switch to teacher type when clicked', () => {
    render(<Login />)
    const teacherButton = screen.getByText('Teacher').closest('button')
    
    if (teacherButton) {
      fireEvent.click(teacherButton)
      expect(teacherButton).toHaveClass('bg-gradient-primary')
    }
  })

  it('should render form fields', () => {
    render(<Login />)
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
  })

  it('should show validation error for invalid email', async () => {
    ;(utils.isValidEmail as jest.Mock).mockReturnValue(false)
    
    const { container } = render(<Login />)
    const form = container.querySelector('form')
    const emailInput = screen.getByLabelText(/Email Address/i)

    if (form) {
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      }, { timeout: 5000 })
    }
  })

  it('should show validation error for short password', async () => {
    const { container } = render(<Login />)
    const form = container.querySelector('form')
    const passwordInput = screen.getByLabelText(/Password/i)

    if (form) {
      fireEvent.change(passwordInput, { target: { value: '123' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument()
      }, { timeout: 5000 })
    }
  })

  it('should call loginUser with student type', async () => {
    const { container } = render(<Login />)
    const form = container.querySelector('form')
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    if (form) {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(utils.loginUser).toHaveBeenCalledWith('test@example.com', 'password123', 'student')
      }, { timeout: 5000 })
    }
  })

  it('should call loginUser with teacher type when teacher is selected', async () => {
    const { container, rerender } = render(<Login />)
    const teacherButton = screen.getByText('Teacher').closest('button')
    
    if (teacherButton) {
      fireEvent.click(teacherButton)
      
      // Re-render to get updated state
      rerender(<Login />)
      
      const form = container.querySelector('form')
      const emailInput = screen.getByLabelText(/Email Address/i)
      const passwordInput = screen.getByLabelText(/Password/i)

      if (form) {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.submit(form)

        await waitFor(() => {
          expect(utils.loginUser).toHaveBeenCalledWith('test@example.com', 'password123', 'teacher')
        }, { timeout: 5000 })
      }
    }
  })

  it('should redirect to student dashboard on successful student login', async () => {
    ;(utils.loginUser as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Login successful!',
      user: { id: '1', email: 'test@example.com', type: 'student' },
    })

    const { container } = render(<Login />)
    const form = container.querySelector('form')
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    if (form) {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/student-dashboard')
      }, { timeout: 5000 })
    }
  })

  it('should redirect to teacher dashboard on successful teacher login', async () => {
    ;(utils.loginUser as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Login successful!',
      user: { id: '1', email: 'test@example.com', type: 'teacher' },
    })

    const { container, rerender } = render(<Login />)
    const teacherButton = screen.getByText('Teacher').closest('button')
    
    if (teacherButton) {
      fireEvent.click(teacherButton)
      
      // Re-render to get updated state
      rerender(<Login />)
      
      const form = container.querySelector('form')
      const emailInput = screen.getByLabelText(/Email Address/i)
      const passwordInput = screen.getByLabelText(/Password/i)

      if (form) {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.submit(form)

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledWith('/teacher-dashboard')
        }, { timeout: 5000 })
      }
    }
  })

  it('should show error message on failed login', async () => {
    ;(utils.loginUser as jest.Mock).mockResolvedValue({
      success: false,
      message: 'Invalid email or password',
    })

    const { container } = render(<Login />)
    const form = container.querySelector('form')
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    if (form) {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
      }, { timeout: 5000 })
    }
  })

  it('should show loading state during login', async () => {
    const { container } = render(<Login />)
    const form = container.querySelector('form')
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    if (form) {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument()
      }, { timeout: 1000 })
    }
  })

  it('should have links to registration pages', () => {
    render(<Login />)
    expect(screen.getByText(/Sign up as/i)).toBeInTheDocument()
    const registerLink = screen.getByRole('link', { name: /Sign up as/i })
    expect(registerLink).toHaveAttribute('href', '/register')
  })

  it('should render Navbar and Footer', () => {
    render(<Login />)
    expect(screen.getByText('Navbar')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})

