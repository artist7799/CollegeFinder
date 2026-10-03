import { API_BASE_URL } from './apiConfig';

const BASE_URL = `${API_BASE_URL}/admin`;


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

const fetchAdminJson = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Admin API error (${response.status})`);
  }
  return data;
};

export const getAdminDashboard = async (token) => {
  return await fetchAdminJson('/dashboard', 'GET', null, token);
};

export const getAdminUsers = async (params = {}, token) => {
  const query = buildQueryString(params);
  return await fetchAdminJson(`/users${query}`, 'GET', null, token);
};

export const updateUserRole = async (userId, role, token) => {
  return await fetchAdminJson(`/users/${userId}/role`, 'PUT', { role }, token);
};

export const getAdminColleges = async (params = {}, token) => {
  const query = buildQueryString(params);
  return await fetchAdminJson(`/colleges${query}`, 'GET', null, token);
};

export const createAdminCollege = async (collegeData, token) => {
  return await fetchAdminJson('/colleges', 'POST', collegeData, token);
};

export const updateAdminCollege = async (collegeId, collegeData, token) => {
  return await fetchAdminJson(`/colleges/${collegeId}`, 'PUT', collegeData, token);
};

export const deleteAdminCollege = async (collegeId, token) => {
  return await fetchAdminJson(`/colleges/${collegeId}`, 'DELETE', null, token);
};

export const getAdminReviews = async (params = {}, token) => {
  const query = buildQueryString(params);
  return await fetchAdminJson(`/reviews${query}`, 'GET', null, token);
};

export const deleteAdminReview = async (reviewId, token) => {
  return await fetchAdminJson(`/reviews/${reviewId}`, 'DELETE', null, token);
};
