// Utility functions for form validation and localStorage

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// Common function to focus on first error field
export const focusFirstErrorField = (errorKeys: string[], fieldOrder: string[]) => {
  if (errorKeys.length === 0) return;
  
  // Find first error field in form order
  const firstErrorField = fieldOrder.find(field => errorKeys.includes(field));
  
  if (firstErrorField) {
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      const element = document.getElementById(firstErrorField) || 
                     document.querySelector(`[name="${firstErrorField}"]`) ||
                     document.querySelector(`input[name="${firstErrorField}"], select[name="${firstErrorField}"], textarea[name="${firstErrorField}"]`);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (element as HTMLElement).focus();
      }
    });
  }
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

export const registerUser = async (userData: User): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Registration failed. Please try again.' };
  }
};

export const loginUser = async (email: string, password: string, type: 'student' | 'teacher'): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, type }),
    });

    const result = await response.json();
    
    if (result.success && result.user) {
      // Set session in localStorage
      const sessionData = {
        user: {
          id: result.user._id || result.user.id,
          email: result.user.email,
          name: result.user.name,
          type: result.user.type,
        },
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem('oneHourStudySession', JSON.stringify(sessionData));
    }
    
    return result;
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, message: 'Login failed. Please try again.' };
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem('oneHourStudySession');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const sessionData = localStorage.getItem('oneHourStudySession');
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    if (!session.user || !session.user.id) return null;

    // Fetch user from API
    const response = await fetch(`/api/users?id=${session.user.id}`);
    const result = await response.json();
    
    if (result.success && result.user) {
      return result.user;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  try {
    const sessionData = localStorage.getItem('oneHourStudySession');
    if (!sessionData) return false;
    const session = JSON.parse(sessionData);
    return !!session.user && !!session.user.id;
  } catch {
    return false;
  }
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

export const createAllocation = async (allocationData: Omit<Allocation, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string; allocation?: any }> => {
  try {
    const response = await fetch('/api/allocations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allocationData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating allocation:', error);
    return { success: false, message: 'Failed to create allocation' };
  }
};

export const getAllocations = async (userId: string, userType: 'student' | 'teacher'): Promise<Allocation[]> => {
  try {
    const response = await fetch(`/api/allocations?userId=${userId}&userType=${userType}`);
    const result = await response.json();
    
    if (result.success && result.allocations) {
      // Convert MongoDB _id to id for compatibility
      return result.allocations.map((a: any) => ({
        ...a,
        id: a._id || a.id,
        studentId: a.studentId?._id || a.studentId,
        teacherId: a.teacherId?._id || a.teacherId,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting allocations:', error);
    return [];
  }
};

export const getAllTeachers = async (): Promise<User[]> => {
  try {
    const response = await fetch('/api/users?type=teacher');
    const result = await response.json();
    
    if (result.success && result.users) {
      // Convert MongoDB _id to id for compatibility
      return result.users.map((u: any) => ({
        ...u,
        id: u._id || u.id,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting teachers:', error);
    return [];
  }
};

export const getAllStudents = async (): Promise<User[]> => {
  try {
    const response = await fetch('/api/users?type=student');
    const result = await response.json();
    
    if (result.success && result.users) {
      // Convert MongoDB _id to id for compatibility
      return result.users.map((u: any) => ({
        ...u,
        id: u._id || u.id,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting students:', error);
    return [];
  }
};

// Request functions
export interface AllocationRequest {
  id?: string;
  _id?: string;
  requesterId: string | { _id?: string; id?: string };
  requesterType: 'student' | 'teacher';
  requesterName: string;
  targetId: string | { _id?: string; id?: string };
  targetType: 'student' | 'teacher';
  targetName: string;
  subjects: string[];
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'allocated';
  createdAt: string;
  allocatedAt?: string;
  allocationId?: string | { _id?: string; id?: string };
}

// Helper function to extract ID from string or object
export const extractId = (id: string | { _id?: string; id?: string } | undefined): string | undefined => {
  if (!id) return undefined;
  if (typeof id === 'string') return id;
  return id._id || id.id;
};

export const createRequest = async (requestData: Omit<AllocationRequest, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating request:', error);
    return { success: false, message: 'Failed to create request' };
  }
};

export const getAllRequests = async (): Promise<AllocationRequest[]> => {
  try {
    const response = await fetch('/api/requests');
    const result = await response.json();
    
    if (result.success && result.requests) {
      // Convert MongoDB _id to id for compatibility
      return result.requests.map((r: any) => ({
        ...r,
        id: r._id || r.id,
        requesterId: r.requesterId?._id || r.requesterId,
        targetId: r.targetId?._id || r.targetId,
        allocationId: r.allocationId?._id || r.allocationId,
        createdAt: r.createdAt || new Date().toISOString(),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting requests:', error);
    return [];
  }
};

export const getRequestsByUser = async (userId: string, userType: 'student' | 'teacher'): Promise<AllocationRequest[]> => {
  try {
    const response = await fetch(`/api/requests?userId=${userId}&userType=${userType}`);
    const result = await response.json();
    
    if (result.success && result.requests) {
      // Convert MongoDB _id to id for compatibility
      return result.requests.map((r: any) => ({
        ...r,
        id: r._id || r.id,
        requesterId: r.requesterId?._id || r.requesterId,
        targetId: r.targetId?._id || r.targetId,
        allocationId: r.allocationId?._id || r.allocationId,
        createdAt: r.createdAt || new Date().toISOString(),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user requests:', error);
    return [];
  }
};

export const updateRequestStatus = async (
  requestId: string, 
  status: 'approved' | 'rejected' | 'allocated',
  allocationId?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/requests/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, allocationId }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating request status:', error);
    return { success: false, message: 'Failed to update request status' };
  }
};

