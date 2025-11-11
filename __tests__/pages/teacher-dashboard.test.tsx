import { render, screen, waitFor } from '@testing-library/react'
import TeacherDashboard from '../../pages/teacher-dashboard'
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
  getAllStudents: jest.fn(),
  getAllocations: jest.fn(),
  createRequest: jest.fn(),
  getRequestsByUser: jest.fn(),
  extractId: jest.fn((id) => id),
}))

describe('TeacherDashboard', () => {
  const mockTeacher = {
    id: 'teacher_1',
    type: 'teacher',
    name: 'Jane Teacher',
    email: 'jane@example.com',
  }

  const mockStudents = [
    {
      id: 'student_1',
      type: 'student',
      name: 'John Doe',
      email: 'john@example.com',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(utils.isAuthenticated as jest.Mock).mockReturnValue(true)
    ;(utils.getCurrentUser as jest.Mock).mockResolvedValue(mockTeacher)
    ;(utils.getAllStudents as jest.Mock).mockResolvedValue(mockStudents)
    ;(utils.getAllocations as jest.Mock).mockResolvedValue([])
    ;(utils.getRequestsByUser as jest.Mock).mockResolvedValue([])
    ;(utils.createRequest as jest.Mock).mockResolvedValue({ success: true, message: 'Request created successfully!' })
  })

  it('should redirect to login if not authenticated', () => {
    ;(utils.isAuthenticated as jest.Mock).mockReturnValue(false)
    
    render(<TeacherDashboard />)
    
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('should redirect to login if user is not a teacher', async () => {
    ;(utils.getCurrentUser as jest.Mock).mockResolvedValue({
      ...mockTeacher,
      type: 'student',
    })
    
    render(<TeacherDashboard />)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should render dashboard for authenticated teacher', async () => {
    render(<TeacherDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Teacher Dashboard/i)).toBeInTheDocument()
    })
  })

  it('should display user information', async () => {
    render(<TeacherDashboard />)
    
    await waitFor(() => {
      // Check for "Welcome, {name}!" pattern
      expect(screen.getByText(/Welcome,/i)).toBeInTheDocument()
      expect(screen.getByText(new RegExp(mockTeacher.name, 'i'))).toBeInTheDocument()
    })
  })

  it('should display students list', async () => {
    render(<TeacherDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(mockStudents[0].name)).toBeInTheDocument()
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

    ;(utils.getAllocations as jest.Mock).mockResolvedValue(mockAllocations)

    render(<TeacherDashboard />)
    
    await waitFor(() => {
      expect(screen.getAllByText(mockAllocations[0].studentName).length).toBeGreaterThan(0)
    })
  })
})

