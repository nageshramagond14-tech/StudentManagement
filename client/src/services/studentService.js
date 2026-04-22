/**
 * Student Service (Production-Ready)
 * 
 * WHY use a service file?
 * - Centralized Configuration: Base URL and headers are managed in one place.
 * - Error Handling: Standardizes how API errors are caught and thrown.
 * - Async/Await: Provides a clean, synchronous-looking way to handle asynchronous network requests.
 * - JWT Authentication: Automatically includes auth headers for protected routes.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Get JWT token from localStorage
 * Returns the token if available, null otherwise
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get auth headers with JWT token
 * Returns headers object with Authorization if token exists
 */
const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Helper to handle fetch responses
 * Handles authentication errors (401, 403) specially
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle authentication errors
    if (response.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    if (response.status === 403) {
      throw new Error('Access denied. Insufficient permissions.');
    }
    
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  return response.json();
};

/**
 * Helper to map MongoDB _id to frontend id
 */
const mapStudent = (student) => {
  if (!student) return student;
  return {
    ...student,
    id: student.id || student._id // Ensure 'id' exists for the frontend
  };
};

export const studentService = {
  /**
   * Fetch all students
   * GET /api/students
   */
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: getAuthHeaders(),
      });
      const data = await handleResponse(response);
      const students = data.data || data;
      return Array.isArray(students) ? students.map(mapStudent) : students;
    } catch (error) {
      console.error('Error in getAll:', error.message);
      throw error;
    }
  },

  /**
   * Get a single student by ID
   * GET /api/students/:id
   */
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        headers: getAuthHeaders(),
      });
      const data = await handleResponse(response);
      return mapStudent(data.data || data);
    } catch (error) {
      console.error(`Error in getById(${id}):`, error.message);
      throw error;
    }
  },

  /**
   * Add a new student
   * POST /api/students
   */
  create: async (studentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(studentData),
      });
      const data = await handleResponse(response);
      return mapStudent(data.data || data);
    } catch (error) {
      console.error('Error in create:', error.message);
      throw error;
    }
  },

  /**
   * Update an existing student
   * PUT /api/students/:id
   */
  update: async (id, studentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(studentData),
      });
      const data = await handleResponse(response);
      return mapStudent(data.data || data);
    } catch (error) {
      console.error(`Error in update(${id}):`, error.message);
      throw error;
    }
  },

  /**
   * Delete a student
   * DELETE /api/students/:id
   */
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error in delete(${id}):`, error.message);
      throw error;
    }
  }
};
