import { API_BASE_URL } from './apiConfig';

const BASE_URL = `${API_BASE_URL}/auth`;


/**
 * Register a new user (student)
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

/**
 * Authenticate user and receive JWT access token
 */
export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Invalid email or password');
  }
  return data;
};

/**
 * Fetch current user profile using JWT token
 */
export const getCurrentUser = async (token) => {
  const response = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Session expired. Please login again.');
  }
  return data;
};
