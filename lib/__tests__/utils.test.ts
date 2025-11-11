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

// Mock fetch for API calls
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

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
    beforeEach(() => {
      (global.fetch as jest.Mock).mockClear();
    });

    it('should register a new user successfully', async () => {
      const userData: User = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Registration successful!',
          user: { ...userData, _id: '123' },
        }),
      });

      const result = await registerUser(userData);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Registration successful!');
    });

    it('should prevent duplicate user registration', async () => {
      const userData: User = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Registration successful!',
            user: { ...userData, _id: '123' },
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({
            success: false,
            message: 'User with this email already exists',
          }),
        });

      await registerUser(userData);
      const result = await registerUser(userData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('User with this email already exists');
    });

    it('should allow same email for different user types', async () => {
      const studentData: User = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Student',
      };

      const teacherData: User = {
        type: 'teacher',
        email: 'test@example.com',
        password: 'password123',
        name: 'Teacher',
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Registration successful!',
            user: { ...studentData, _id: '123' },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Registration successful!',
            user: { ...teacherData, _id: '456' },
          }),
        });

      const studentResult = await registerUser(studentData);
      const teacherResult = await registerUser(teacherData);

      expect(studentResult.success).toBe(true);
      expect(teacherResult.success).toBe(true);
    });
  })

  describe('loginUser', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockClear();
    });

    it('should login with correct credentials', async () => {
      const userData = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        _id: '123',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Login successful!',
          user: userData,
        }),
      });

      const result = await loginUser('test@example.com', 'password123', 'student');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Login successful!');
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');

      const session = JSON.parse(localStorage.getItem('oneHourStudySession') || '{}');
      expect(session.user).toBeDefined();
    })

    it('should fail with incorrect password', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Invalid email or password',
        }),
      });

      const result = await loginUser('test@example.com', 'wrongpassword', 'student');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid email or password');
    })

    it('should fail with non-existent user', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'User not found',
        }),
      });

      const result = await loginUser('nonexistent@example.com', 'password123', 'student');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('User not found');
    })

    it('should fail with wrong user type', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'User not found',
        }),
      });

      const result = await loginUser('test@example.com', 'password123', 'teacher');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('User not found');
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
    beforeEach(() => {
      (global.fetch as jest.Mock).mockClear();
    });

    it('should return null when no session exists', async () => {
      const user = await getCurrentUser();
      expect(user).toBeNull();
    })

    it('should return user when session exists', async () => {
      const userData = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        _id: 'student_123',
      };

      // Mock login
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Login successful!',
          user: userData,
        }),
      });

      await loginUser('test@example.com', 'password123', 'student');

      // Mock getCurrentUser API call
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: userData,
        }),
      });

      const user = await getCurrentUser();
      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
    })
  })

  describe('isAuthenticated', () => {
    beforeEach(() => {
      localStorage.clear();
      (global.fetch as jest.Mock).mockClear();
    });

    it('should return false when no user is logged in', () => {
      expect(isAuthenticated()).toBe(false);
    })

    it('should return true when user is logged in', async () => {
      const userData = {
        type: 'student',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        _id: '123',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Login successful!',
          user: userData,
        }),
      });

      await loginUser('test@example.com', 'password123', 'student');

      expect(isAuthenticated()).toBe(true);
    })
  })
})

describe('Allocation Functions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('createAllocation', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockClear();
    });

    it('should create a new allocation', async () => {
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
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Allocation created successfully!',
          allocation: { ...allocationData, _id: 'alloc_1' },
        }),
      });

      const result = await createAllocation(allocationData);
      expect(result.success).toBe(true);
    })

    it('should prevent duplicate active allocations', async () => {
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
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Allocation created successfully!',
            allocation: { ...allocationData, _id: 'alloc_1' },
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({
            success: false,
            message: 'Allocation already exists for this student-teacher pair',
          }),
        });

      await createAllocation(allocationData);
      const result = await createAllocation(allocationData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Allocation already exists for this student-teacher pair');
    })
  })

  describe('getAllTeachers', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockClear();
    });

    it('should return all teachers', async () => {
      const teachers = [
        { type: 'teacher', email: 'teacher1@example.com', name: 'Teacher 1', _id: '1' },
        { type: 'teacher', email: 'teacher2@example.com', name: 'Teacher 2', _id: '2' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          users: teachers,
        }),
      });

      const result = await getAllTeachers();
      expect(result).toHaveLength(2);
      expect(result.every(t => t.type === 'teacher')).toBe(true);
    })

    it('should return empty array when no teachers exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          users: [],
        }),
      });

      const result = await getAllTeachers();
      expect(result).toEqual([]);
    })
  })

  describe('getAllStudents', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockClear();
    });

    it('should return all students', async () => {
      const students = [
        { type: 'student', email: 'student1@example.com', name: 'Student 1', _id: '1' },
        { type: 'student', email: 'student2@example.com', name: 'Student 2', _id: '2' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          users: students,
        }),
      });

      const result = await getAllStudents();
      expect(result).toHaveLength(2);
      expect(result.every(s => s.type === 'student')).toBe(true);
    })

    it('should return empty array when no students exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          users: [],
        }),
      });

      const result = await getAllStudents();
      expect(result).toEqual([]);
    })

    it('should handle errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const students = await getAllStudents();
      expect(students).toEqual([]);
    })
  })

  describe('getAllTeachers error handling', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockClear();
    });

    it('should handle errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const teachers = await getAllTeachers();
      expect(teachers).toEqual([]);
    })
  })

  describe('getAllocations', () => {
    beforeEach(() => {
      localStorage.clear();
      (global.fetch as jest.Mock).mockClear();
    });

    it('should return allocations for a student', async () => {
      const studentId = 'student_1';
      const allocations = [
        {
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
          _id: 'alloc_1',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          allocations,
        }),
      });

      const result = await getAllocations(studentId, 'student');
      
      expect(result).toHaveLength(1);
      expect(result[0].studentId).toBe(studentId);
    })

    it('should return allocations for a teacher', async () => {
      const teacherId = 'teacher_1';
      const allocations = [
        {
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
          _id: 'alloc_1',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          allocations,
        }),
      });

      const result = await getAllocations(teacherId, 'teacher');
      
      expect(result).toHaveLength(1);
      expect(result[0].teacherId).toBe(teacherId);
    })

    it('should return empty array when no allocations exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          allocations: [],
        }),
      });

      const allocations = await getAllocations('student_1', 'student');
      expect(allocations).toEqual([]);
    })

    it('should only return active allocations', async () => {
      const studentId = 'student_1';
      const allocations = [
        {
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
          _id: 'alloc_1',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          allocations,
        }),
      });

      const activeAllocations = await getAllocations(studentId, 'student');
      expect(activeAllocations).toHaveLength(1);
      expect(activeAllocations[0].status).toBe('active');
    })

    it('should handle errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const allocations = await getAllocations('student_1', 'student');
      expect(allocations).toEqual([]);
    })
  })

  describe('Error handling', () => {
    it('should handle errors in registerUser', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await registerUser({
        type: 'student',
        email: 'test@example.com',
        password: 'pass',
        name: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Registration failed. Please try again.');
    })

    it('should handle errors in loginUser', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await loginUser('test@example.com', 'pass', 'student');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Login failed. Please try again.');
    })

    it('should handle errors in getCurrentUser', async () => {
      localStorage.setItem('oneHourStudySession', JSON.stringify({ user: { id: '123' } }));
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const user = await getCurrentUser();
      expect(user).toBeNull();
    })

    it('should handle errors in createAllocation', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await createAllocation({
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
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to create allocation');
    })

    it('should handle errors in saveToLocalStorage', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const result = saveToLocalStorage('test-key', { name: 'Test' });
      expect(result).toBe(false);

      localStorage.setItem = originalSetItem;
    })
  })
})

