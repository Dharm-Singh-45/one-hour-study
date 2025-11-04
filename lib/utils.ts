// Utility functions for form validation and localStorage

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const saveToLocalStorage = (key: string, data: any): boolean => {
  try {
    const registrations = JSON.parse(
      localStorage.getItem('oneHourStudyRegistrations') || '[]'
    );
    registrations.push({
      key,
      data,
      date: new Date().toISOString(),
    });
    localStorage.setItem('oneHourStudyRegistrations', JSON.stringify(registrations));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Authentication functions
export interface User {
  type: 'student' | 'teacher';
  email: string;
  password: string;
  name: string;
  [key: string]: any;
}

export const registerUser = (userData: User): { success: boolean; message: string } => {
  try {
    const users = JSON.parse(localStorage.getItem('oneHourStudyUsers') || '[]');
    
    // Check if user already exists
    const existingUser = users.find((u: User) => u.email === userData.email && u.type === userData.type);
    if (existingUser) {
      return { success: false, message: 'User with this email already exists' };
    }

    // Save user with password
    const userToSave = {
      ...userData,
      id: `${userData.type}_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    users.push(userToSave);
    localStorage.setItem('oneHourStudyUsers', JSON.stringify(users));
    
    return { success: true, message: 'Registration successful!' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Registration failed. Please try again.' };
  }
};

export const loginUser = (email: string, password: string, type: 'student' | 'teacher'): { success: boolean; message: string; user?: User } => {
  try {
    const users = JSON.parse(localStorage.getItem('oneHourStudyUsers') || '[]');
    
    const user = users.find((u: User) => u.email === email && u.type === type);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Set session
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
      },
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem('oneHourStudySession', JSON.stringify(sessionData));
    
    return { success: true, message: 'Login successful!', user };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, message: 'Login failed. Please try again.' };
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem('oneHourStudySession');
};

export const getCurrentUser = (): User | null => {
  try {
    const sessionData = localStorage.getItem('oneHourStudySession');
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    const users = JSON.parse(localStorage.getItem('oneHourStudyUsers') || '[]');
    const user = users.find((u: User) => u.id === session.user.id);
    
    return user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Allocation/Matching functions
export interface Allocation {
  id: string;
  studentId: string;
  teacherId: string;
  studentName: string;
  teacherName: string;
  subjects: string[];
  fees: number;
  time: string;
  days: string[];
  startDate: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export const createAllocation = (allocationData: Omit<Allocation, 'id' | 'createdAt'>): { success: boolean; message: string } => {
  try {
    const allocations = JSON.parse(localStorage.getItem('oneHourStudyAllocations') || '[]');
    
    // Check if allocation already exists
    const existing = allocations.find((a: Allocation) => 
      a.studentId === allocationData.studentId && 
      a.teacherId === allocationData.teacherId && 
      a.status === 'active'
    );
    
    if (existing) {
      return { success: false, message: 'Allocation already exists for this student-teacher pair' };
    }

    const allocation: Allocation = {
      ...allocationData,
      id: `alloc_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    allocations.push(allocation);
    localStorage.setItem('oneHourStudyAllocations', JSON.stringify(allocations));
    
    return { success: true, message: 'Allocation created successfully!' };
  } catch (error) {
    console.error('Error creating allocation:', error);
    return { success: false, message: 'Failed to create allocation' };
  }
};

export const getAllocations = (userId: string, userType: 'student' | 'teacher'): Allocation[] => {
  try {
    const allocations = JSON.parse(localStorage.getItem('oneHourStudyAllocations') || '[]');
    const user = getCurrentUser();
    
    if (!user) return [];
    
    if (userType === 'student') {
      return allocations.filter((a: Allocation) => a.studentId === user.id && a.status === 'active');
    } else {
      return allocations.filter((a: Allocation) => a.teacherId === user.id && a.status === 'active');
    }
  } catch (error) {
    console.error('Error getting allocations:', error);
    return [];
  }
};

export const getAllTeachers = (): User[] => {
  try {
    const users = JSON.parse(localStorage.getItem('oneHourStudyUsers') || '[]');
    return users.filter((u: User) => u.type === 'teacher');
  } catch (error) {
    console.error('Error getting teachers:', error);
    return [];
  }
};

export const getAllStudents = (): User[] => {
  try {
    const users = JSON.parse(localStorage.getItem('oneHourStudyUsers') || '[]');
    return users.filter((u: User) => u.type === 'student');
  } catch (error) {
    console.error('Error getting students:', error);
    return [];
  }
};

