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
  createAllocation: jest.fn(),
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
    ;(utils.getCurrentUser as jest.Mock).mockReturnValue(mockStudent)
    ;(utils.getAllTeachers as jest.Mock).mockReturnValue(mockTeachers)
    ;(utils.getAllocations as jest.Mock).mockReturnValue([])
    ;(utils.createAllocation as jest.Mock).mockReturnValue({ success: true, message: 'Allocation created successfully!' })
    
    // Mock window.alert
    window.alert = jest.fn()
  })

  it('should redirect to login if not authenticated', () => {
    ;(utils.isAuthenticated as jest.Mock).mockReturnValue(false)
    
    render(<StudentDashboard />)
    
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('should redirect to login if user is not a student', () => {
    ;(utils.getCurrentUser as jest.Mock).mockReturnValue({
      ...mockStudent,
      type: 'teacher',
    })
    
    render(<StudentDashboard />)
    
    expect(mockPush).toHaveBeenCalledWith('/login')
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

  it('should show allocation form when teacher is selected', async () => {
    render(<StudentDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(mockTeachers[0].name)).toBeInTheDocument()
    })

    const allocateButton = screen.getAllByText(/Allocate/i)[0]
    fireEvent.click(allocateButton)

    await waitFor(() => {
      expect(screen.getByText(/Create Allocation/i)).toBeInTheDocument()
    })
  })

  it('should create allocation when form is submitted', async () => {
    render(<StudentDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(mockTeachers[0].name)).toBeInTheDocument()
    })

    const allocateButton = screen.getAllByText(/Allocate Teacher/i)[0]
    fireEvent.click(allocateButton)

    await waitFor(() => {
      expect(screen.getByText(/Create Allocation/i)).toBeInTheDocument()
    })

    // Use placeholder or querySelector for form fields
    const feesInput = screen.getByPlaceholderText(/Enter fees/i) || document.querySelector('input[type="number"]')
    const timeInput = screen.getByPlaceholderText(/e.g., 4:00 PM/i) || document.querySelector('input[placeholder*="PM"]')
    const submitButton = screen.getByRole('button', { name: /Create Allocation/i })

    if (feesInput) fireEvent.change(feesInput, { target: { value: '1000' } })
    if (timeInput) fireEvent.change(timeInput, { target: { value: '10:00 AM' } })

    // Select a day - use querySelector as fallback
    const mondayCheckbox = screen.queryByLabelText('Monday') || document.querySelector('input[type="checkbox"][value="Monday"]') || document.querySelector('input[type="checkbox"]')
    if (mondayCheckbox) fireEvent.click(mondayCheckbox)

    // Select a subject - use querySelector as fallback
    const mathCheckbox = screen.queryByLabelText('Mathematics') || document.querySelector('input[type="checkbox"][value="Mathematics"]')
    if (mathCheckbox) fireEvent.click(mathCheckbox)

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(utils.createAllocation).toHaveBeenCalled()
    })
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

    ;(utils.getAllocations as jest.Mock).mockReturnValue(mockAllocations)

    render(<StudentDashboard />)
    
    await waitFor(() => {
      // There might be multiple instances, so use getAllByText
      expect(screen.getAllByText(mockAllocations[0].teacherName).length).toBeGreaterThan(0)
    })
  })
})

