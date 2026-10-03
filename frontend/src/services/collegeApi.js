import { API_BASE_URL } from './apiConfig';

const BASE_URL = API_BASE_URL;


/**
 * Helper to construct URL query string from parameter object
 */
const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const val = params[key];
    if (val !== undefined && val !== null && val !== '') {
      searchParams.append(key, val);
    }
  });
  const str = searchParams.toString();
  return str ? `?${str}` : '';
};

/**
 * Handles HTTP requests and uniform error reporting
 */
const fetchJson = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Server error (${response.status})`);
    }
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to CollegeFinder server. Please make sure the Flask backend is running.');
    }
    throw error;
  }
};

/**
 * Fetch colleges list with search, filter, sort, and pagination query options
 */
export const getColleges = async (params = {}) => {
  const queryString = buildQueryString(params);
  return await fetchJson(`/colleges${queryString}`);
};

/**
 * Fetch single college details by ID (includes courses and placement information)
 */
export const getCollege = async (id) => {
  return await fetchJson(`/colleges/${id}`);
};

/**
 * Fetch unique available filter choices (states, cities, college_types, universities)
 */
export const getFilterOptions = async () => {
  return await fetchJson('/colleges/filters');
};

/**
 * Fetch courses for a specific college ID
 */
export const getCollegeCourses = async (id) => {
  return await fetchJson(`/colleges/${id}/courses`);
};

/**
 * Fetch placement details for a specific college ID
 */
export const getCollegePlacement = async (id) => {
  return await fetchJson(`/colleges/${id}/placement`);
};
