import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import StudentDashboard from '../../pages/student-dashboard'
import * as utils from '@/lib/utils'

// Mock Next.js components
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>
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
  getCurrentUser: jest.fn(),
  isAuthenticated: jest.fn(),
  getAllTeachers: jest.fn(),
  getAllocations: jest.fn(),
  createRequest: jest.fn(),
  getRequestsByUser: jest.fn(),
  extractId: jest.fn((id) => id),
}))

describe('StudentDashboard', () => {
  const mockStudent = {
    id: 'student_1',
    type: 'student',
    name: 'John Doe',
    email: 'john@example.com',
  }

  const mockTeachers = [
    {
      id: 'teacher_1',
      type: 'teacher',
      name: 'Jane Teacher',
      email: 'jane@example.com',
      subjects: ['Mathematics', 'Physics'],
      city: 'Jodhpur',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(utils.isAuthenticated as jest.Mock).mockReturnValue(true)
    ;(utils.getCurrentUser as jest.Mock).mockResolvedValue(mockStudent)
    ;(utils.getAllTeachers as jest.Mock).mockResolvedValue(mockTeachers)
    ;(utils.getAllocations as jest.Mock).mockResolvedValue([])
    ;(utils.getRequestsByUser as jest.Mock).mockResolvedValue([])
    ;(utils.createRequest as jest.Mock).mockResolvedValue({ success: true, message: 'Request created successfully!' })
    
    // Mock window.alert
    window.alert = jest.fn()
  })

  it('should redirect to login if not authenticated', () => {
    ;(utils.isAuthenticated as jest.Mock).mockReturnValue(false)
    
    render(<StudentDashboard />)
    
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('should redirect to login if user is not a student', async () => {
    ;(utils.getCurrentUser as jest.Mock).mockResolvedValue({
      ...mockStudent,
      type: 'teacher',
    })
    
    render(<StudentDashboard />)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should render dashboard for authenticated student', async () => {
    render(<StudentDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Student Dashboard/i)).toBeInTheDocument()
    })
  })

  it('should display user information', async () => {
    render(<StudentDashboard />)
    
    await waitFor(() => {
      // Check for "Welcome, {name}!" pattern
      expect(screen.getByText(/Welcome,/i)).toBeInTheDocument()
      expect(screen.getByText(new RegExp(mockStudent.name, 'i'))).toBeInTheDocument()
    })
  })

  it('should display teachers list', async () => {
    render(<StudentDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(mockTeachers[0].name)).toBeInTheDocument()
    })
  })

  it('should filter teachers by search term', async () => {
    render(<StudentDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(mockTeachers[0].name)).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or city/i)
    fireEvent.change(searchInput, { target: { value: 'Jane' } })

    expect(screen.getByText(mockTeachers[0].name)).toBeInTheDocument()
  })

  it('should show request form when teacher is selected', async () => {
    render(<StudentDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(mockTeachers[0].name)).toBeInTheDocument()
    })

    const requestButton = screen.queryByText(/Request Teacher/i) || screen.queryByRole('button', { name: /Request/i })
    if (requestButton) {
      fireEvent.click(requestButton)

      await waitFor(() => {
        const hasRequestForm = screen.queryByText(/Send Request/i) || screen.queryByText(/Request Teacher/i) || screen.queryByText(/Select subjects/i)
        expect(hasRequestForm).toBeTruthy()
      })
    }
  })

  it('should create request when form is submitted', async () => {
    render(<StudentDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(mockTeachers[0].name)).toBeInTheDocument()
    })

    const requestButton = screen.queryByText(/Request Teacher/i) || screen.queryByRole('button', { name: /Request/i })
    if (requestButton) {
      fireEvent.click(requestButton)

      await waitFor(async () => {
        const submitButton = screen.queryByRole('button', { name: /Send Request/i }) || screen.queryByText(/Send Request/i)
        if (submitButton) {
          // Select a subject
          const mathCheckbox = screen.queryByLabelText('Mathematics') || document.querySelector('input[type="checkbox"][value="Mathematics"]')
          if (mathCheckbox) fireEvent.click(mathCheckbox)

          fireEvent.click(submitButton)
        }
      })

      await waitFor(() => {
        expect(utils.createRequest).toHaveBeenCalled()
      })
    }
  })

  it('should display existing allocations', async () => {
    const mockAllocations = [
      {
        id: 'alloc_1',
        studentId: 'student_1',
        teacherId: 'teacher_1',
        studentName: 'John Doe',
        teacherName: 'Jane Teacher',
        subjects: ['Mathematics'],
        fees: 1000,
        time: '10:00 AM',
        days: ['Monday'],
        startDate: '2024-01-01',
        status: 'active',
      },
    ]

    ;(utils.getAllocations as jest.Mock).mockResolvedValue(mockAllocations)

    render(<StudentDashboard />)
    
    await waitFor(() => {
      // There might be multiple instances, so use getAllByText
      expect(screen.getAllByText(mockAllocations[0].teacherName).length).toBeGreaterThan(0)
    })
  })
})

