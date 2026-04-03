import type { Student, LoginCredentials } from '../types/Student';
import type { Faculty, FacultyLoginCredentials } from '../types/Faculty';
import type { AppEvent } from '../types/Event';
import { getToken } from './auth';

const STUDENT_API_URL = 'http://localhost:8081/students';
const EVENT_API_URL = 'http://localhost:8082/events';
const FACULTY_API_URL = 'http://localhost:8083/faculty';

const parseMaybeJson = (text: string) => {
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userInfo');
      window.location.href = '/'; 
    }
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

// --- STUDENT ENDPOINTS ---

export const registerStudent = async (student: Student) => {
  return fetchWithAuth(`${STUDENT_API_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(student),
  });
};

export const loginStudent = async (credentials: LoginCredentials) => {
  return fetchWithAuth(`${STUDENT_API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const getStudentEvents = async (rollNumber: string): Promise<AppEvent[]> => {
  return fetchWithAuth(`${EVENT_API_URL}/student/${rollNumber}`);
};

// --- FACULTY ENDPOINTS ---

export const registerFaculty = async (faculty: Faculty) => {
  return fetchWithAuth(`${FACULTY_API_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(faculty),
  });
};

export const loginFaculty = async (credentials: FacultyLoginCredentials) => {
  return fetchWithAuth(`${FACULTY_API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// --- EVENT MANAGEMENT ENDPOINTS ---

export const addEvent = async (event: AppEvent) => {
  return fetchWithAuth(`${EVENT_API_URL}/add`, {
    method: 'POST',
    body: JSON.stringify(event),
  });
};

export const getFacultyEvents = async (facultyId: string, month: string): Promise<AppEvent[]> => {
  return fetchWithAuth(`${EVENT_API_URL}/faculty/${facultyId}/${month}`);
};

export const updateEvent = async (id: string, facultyId: string, event: AppEvent) => {
  return fetchWithAuth(`${EVENT_API_URL}/update/${id}/${facultyId}`, {
    method: 'PUT',
    body: JSON.stringify(event),
  });
};

export const deleteEvent = async (id: string, facultyId: string) => {
  const token = getToken();
  const response = await fetch(`${EVENT_API_URL}/delete/${id}/${facultyId}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/'; 
    }
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }
  
  const text = await response.text();
  return parseMaybeJson(text);
};

export const updateStudentEvent = async (id: string, rollNumber: string, event: AppEvent) => {
  return fetchWithAuth(`${EVENT_API_URL}/student/update/${id}/${rollNumber}`, {
    method: 'PUT',
    body: JSON.stringify(event),
  });
};

export const deleteStudentEvent = async (id: string, rollNumber: string) => {
  const token = getToken();
  const response = await fetch(`${EVENT_API_URL}/student/delete/${id}/${rollNumber}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/';
    }
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  const text = await response.text();
  return parseMaybeJson(text);
};
