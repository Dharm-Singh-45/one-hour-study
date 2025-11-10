import {
  isValidEmail,
  isValidPhone,
  saveToLocalStorage,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  createAllocation,
  getAllocations,
  getAllTeachers,
  getAllStudents,
  type User,
  type Allocation,
} from '../utils'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Validation Functions', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('invalid@example')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isValidPhone', () => {
    it('should return true for valid phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(true)
      expect(isValidPhone('9876543210')).toBe(true)
      expect(isValidPhone('123 456 7890')).toBe(true) // with spaces
    })

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhone('12345')).toBe(false) // too short
      expect(isValidPhone('12345678901')).toBe(false) // too long
      expect(isValidPhone('abc1234567')).toBe(false) // contains letters
      expect(isValidPhone('')).toBe(false)
    })
  })
})

describe('LocalStorage Functions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveToLocalStorage', () => {
    it('should save data to localStorage', () => {
      const result = saveToLocalStorage('test-key', { name: 'Test' })
      expect(result).toBe(true)
      
      const saved = JSON.parse(localStorage.getItem('oneHourStudyRegistrations') || '[]')
      expect(saved).toHaveLength(1)
      expect(saved[0].key).toBe('test-key')
      expect(saved[0].data).toEqual({ name: 'Test' })
    })

    it('should append to existing registrations', () => {
      saveToLocalStorage('key1', { data: '1' })
      saveToLocalStorage('key2', { data: '2' })
      
      const saved = JSON.parse(localStorage.getItem('oneHourStudyRegistrations') || '[]')
      expect(saved).toHaveLength(2)
    })
  })
})

describe('Authentication Functions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('registerUser', () => {
    it('should register a new user successfully', () => {
      const userData: User = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      const result = registerUser(userData)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Registration successful!')

      const users = JSON.parse(localStorage.getItem('oneHourStudyUsers') || '[]')
      expect(users).toHaveLength(1)
      expect(users[0].email).toBe('test@example.com')
      expect(users[0].type).toBe('student')
    })

    it('should prevent duplicate user registration', () => {
      const userData: User = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      registerUser(userData)
      const result = registerUser(userData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('User with this email already exists')
    })

    it('should allow same email for different user types', () => {
      const studentData: User = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Student',
      }

      const teacherData: User = {
        type: 'teacher',
        email: 'test@example.com',
        password: 'password123',
        name: 'Teacher',
      }

      const studentResult = registerUser(studentData)
      const teacherResult = registerUser(teacherData)

      expect(studentResult.success).toBe(true)
      expect(teacherResult.success).toBe(true)

      const users = JSON.parse(localStorage.getItem('oneHourStudyUsers') || '[]')
      expect(users).toHaveLength(2)
    })
  })

  describe('loginUser', () => {
    beforeEach(() => {
      const userData: User = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }
      registerUser(userData)
    })

    it('should login with correct credentials', () => {
      const result = loginUser('test@example.com', 'password123', 'student')
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Login successful!')
      expect(result.user).toBeDefined()
      expect(result.user?.email).toBe('test@example.com')

      const session = JSON.parse(localStorage.getItem('oneHourStudySession') || '{}')
      expect(session.user).toBeDefined()
    })

    it('should fail with incorrect password', () => {
      const result = loginUser('test@example.com', 'wrongpassword', 'student')
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid email or password')
    })

    it('should fail with non-existent user', () => {
      const result = loginUser('nonexistent@example.com', 'password123', 'student')
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('User not found')
    })

    it('should fail with wrong user type', () => {
      const result = loginUser('test@example.com', 'password123', 'teacher')
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('User not found')
    })
  })

  describe('logoutUser', () => {
    it('should remove session from localStorage', () => {
      localStorage.setItem('oneHourStudySession', JSON.stringify({ user: { id: '1' } }))
      
      logoutUser()
      
      expect(localStorage.getItem('oneHourStudySession')).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('should return null when no session exists', () => {
      expect(getCurrentUser()).toBeNull()
    })

    it('should return user when session exists', () => {
      const userData: User = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        id: 'student_123',
      }
      registerUser(userData)
      loginUser('test@example.com', 'password123', 'student')

      const user = getCurrentUser()
      expect(user).toBeDefined()
      expect(user?.email).toBe('test@example.com')
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when no user is logged in', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('should return true when user is logged in', () => {
      const userData: User = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }
      registerUser(userData)
      loginUser('test@example.com', 'password123', 'student')

      expect(isAuthenticated()).toBe(true)
    })
  })
})

describe('Allocation Functions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('createAllocation', () => {
    it('should create a new allocation', () => {
      const allocationData: Omit<Allocation, 'id' | 'createdAt'> = {
        studentId: 'student_1',
        teacherId: 'teacher_1',
        studentName: 'Student',
        teacherName: 'Teacher',
        subjects: ['Math'],
        fees: 1000,
        time: '10:00 AM',
        days: ['Monday', 'Wednesday'],
        startDate: '2024-01-01',
        status: 'active',
      }

      const result = createAllocation(allocationData)
      expect(result.success).toBe(true)

      const allocations = JSON.parse(localStorage.getItem('oneHourStudyAllocations') || '[]')
      expect(allocations).toHaveLength(1)
      expect(allocations[0].studentId).toBe('student_1')
    })

    it('should prevent duplicate active allocations', () => {
      const allocationData: Omit<Allocation, 'id' | 'createdAt'> = {
        studentId: 'student_1',
        teacherId: 'teacher_1',
        studentName: 'Student',
        teacherName: 'Teacher',
        subjects: ['Math'],
        fees: 1000,
        time: '10:00 AM',
        days: ['Monday'],
        startDate: '2024-01-01',
        status: 'active',
      }

      createAllocation(allocationData)
      const result = createAllocation(allocationData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Allocation already exists for this student-teacher pair')
    })
  })

  describe('getAllTeachers', () => {
    it('should return all teachers', () => {
      registerUser({
        type: 'teacher',
        email: 'teacher1@example.com',
        password: 'pass',
        name: 'Teacher 1',
      })
      registerUser({
        type: 'teacher',
        email: 'teacher2@example.com',
        password: 'pass',
        name: 'Teacher 2',
      })
      registerUser({
        type: 'student',
        email: 'student@example.com',
        password: 'pass',
        name: 'Student',
      })

      const teachers = getAllTeachers()
      expect(teachers).toHaveLength(2)
      expect(teachers.every(t => t.type === 'teacher')).toBe(true)
    })

    it('should return empty array when no teachers exist', () => {
      expect(getAllTeachers()).toEqual([])
    })
  })

  describe('getAllStudents', () => {
    it('should return all students', () => {
      registerUser({
        type: 'student',
        email: 'student1@example.com',
        password: 'pass',
        name: 'Student 1',
      })
      registerUser({
        type: 'student',
        email: 'student2@example.com',
        password: 'pass',
        name: 'Student 2',
      })
      registerUser({
        type: 'teacher',
        email: 'teacher@example.com',
        password: 'pass',
        name: 'Teacher',
      })

      const students = getAllStudents()
      expect(students).toHaveLength(2)
      expect(students.every(s => s.type === 'student')).toBe(true)
    })

    it('should return empty array when no students exist', () => {
      expect(getAllStudents()).toEqual([])
    })

    it('should handle errors gracefully', () => {
      // Mock localStorage.getItem to throw an error
      const originalGetItem = localStorage.getItem
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error')
      })

      const students = getAllStudents()
      expect(students).toEqual([])

      // Restore original function
      localStorage.getItem = originalGetItem
    })
  })

  describe('getAllTeachers', () => {
    it('should handle errors gracefully', () => {
      // Mock localStorage.getItem to throw an error
      const originalGetItem = localStorage.getItem
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error')
      })

      const teachers = getAllTeachers()
      expect(teachers).toEqual([])

      // Restore original function
      localStorage.getItem = originalGetItem
    })
  })

  describe('getAllocations', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('should return allocations for a student', () => {
      const userData: User = {
        type: 'student',
        email: 'student@example.com',
        password: 'pass',
        name: 'Student',
      }
      const result = registerUser(userData)
      expect(result.success).toBe(true)
      
      loginUser('student@example.com', 'pass', 'student')
      
      // Get the actual user ID from the registered user
      const user = getCurrentUser()
      expect(user).toBeDefined()
      const studentId = user!.id

      const allocationData: Omit<Allocation, 'id' | 'createdAt'> = {
        studentId: studentId,
        teacherId: 'teacher_1',
        studentName: 'Student',
        teacherName: 'Teacher',
        subjects: ['Math'],
        fees: 1000,
        time: '10:00 AM',
        days: ['Monday'],
        startDate: '2024-01-01',
        status: 'active',
      }

      createAllocation(allocationData)
      const allocations = getAllocations(studentId, 'student')
      
      expect(allocations).toHaveLength(1)
      expect(allocations[0].studentId).toBe(studentId)
    })

    it('should return allocations for a teacher', () => {
      const teacherData: User = {
        type: 'teacher',
        email: 'teacher@example.com',
        password: 'pass',
        name: 'Teacher',
      }
      registerUser(teacherData)
      loginUser('teacher@example.com', 'pass', 'teacher')

      // Get the actual user ID from the registered user
      const user = getCurrentUser()
      expect(user).toBeDefined()
      const teacherId = user!.id

      const allocationData: Omit<Allocation, 'id' | 'createdAt'> = {
        studentId: 'student_1',
        teacherId: teacherId,
        studentName: 'Student',
        teacherName: 'Teacher',
        subjects: ['Math'],
        fees: 1000,
        time: '10:00 AM',
        days: ['Monday'],
        startDate: '2024-01-01',
        status: 'active',
      }

      createAllocation(allocationData)
      const allocations = getAllocations(teacherId, 'teacher')
      
      expect(allocations).toHaveLength(1)
      expect(allocations[0].teacherId).toBe(teacherId)
    })

    it('should return empty array when user is not logged in', () => {
      logoutUser()
      const allocations = getAllocations('student_1', 'student')
      expect(allocations).toEqual([])
    })

    it('should only return active allocations', () => {
      const userData: User = {
        type: 'student',
        email: 'student@example.com',
        password: 'pass',
        name: 'Student',
      }
      registerUser(userData)
      loginUser('student@example.com', 'pass', 'student')

      // Get the actual user ID from the registered user
      const user = getCurrentUser()
      expect(user).toBeDefined()
      const studentId = user!.id

      const allocationData: Omit<Allocation, 'id' | 'createdAt'> = {
        studentId: studentId,
        teacherId: 'teacher_1',
        studentName: 'Student',
        teacherName: 'Teacher',
        subjects: ['Math'],
        fees: 1000,
        time: '10:00 AM',
        days: ['Monday'],
        startDate: '2024-01-01',
        status: 'active',
      }

      createAllocation(allocationData)
      
      // Manually add a completed allocation to localStorage
      const allocations = JSON.parse(localStorage.getItem('oneHourStudyAllocations') || '[]')
      const completedAllocation: Allocation = {
        ...allocationData,
        id: 'alloc_completed',
        createdAt: new Date().toISOString(),
        status: 'completed',
      }
      allocations.push(completedAllocation)
      localStorage.setItem('oneHourStudyAllocations', JSON.stringify(allocations))

      const activeAllocations = getAllocations(studentId, 'student')
      expect(activeAllocations).toHaveLength(1)
      expect(activeAllocations[0].status).toBe('active')
    })

    it('should handle errors gracefully', () => {
      const originalGetItem = localStorage.getItem
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error')
      })

      const allocations = getAllocations('student_1', 'student')
      expect(allocations).toEqual([])

      localStorage.getItem = originalGetItem
    })
  })

  describe('Error handling', () => {
    it('should handle errors in registerUser', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error')
      })

      const result = registerUser({
        type: 'student',
        email: 'test@example.com',
        password: 'pass',
        name: 'Test',
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('Registration failed. Please try again.')

      localStorage.setItem = originalSetItem
    })

    it('should handle errors in loginUser', () => {
      const originalGetItem = localStorage.getItem
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error')
      })

      const result = loginUser('test@example.com', 'pass', 'student')
      expect(result.success).toBe(false)
      expect(result.message).toBe('Login failed. Please try again.')

      localStorage.getItem = originalGetItem
    })

    it('should handle errors in getCurrentUser', () => {
      const originalGetItem = localStorage.getItem
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error')
      })

      const user = getCurrentUser()
      expect(user).toBeNull()

      localStorage.getItem = originalGetItem
    })

    it('should handle errors in createAllocation', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error')
      })

      const result = createAllocation({
        studentId: 'student_1',
        teacherId: 'teacher_1',
        studentName: 'Student',
        teacherName: 'Teacher',
        subjects: ['Math'],
        fees: 1000,
        time: '10:00 AM',
        days: ['Monday'],
        startDate: '2024-01-01',
        status: 'active',
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('Failed to create allocation')

      localStorage.setItem = originalSetItem
    })

    it('should handle errors in saveToLocalStorage', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error')
      })

      const result = saveToLocalStorage('test-key', { name: 'Test' })
      expect(result).toBe(false)

      localStorage.setItem = originalSetItem
    })
  })
})

