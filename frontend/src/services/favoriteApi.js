import { API_BASE_URL } from './apiConfig';

const BASE_URL = `${API_BASE_URL}/favorites`;


/**
 * Add a college to authenticated user's favorites
 */
export const addFavorite = async (collegeId, token) => {
  const response = await fetch(`${BASE_URL}/${collegeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add favorite');
  }
  return data;
};

/**
 * Remove a college from authenticated user's favorites
 */
export const removeFavorite = async (collegeId, token) => {
  const response = await fetch(`${BASE_URL}/${collegeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to remove favorite');
  }
  return data;
};

/**
 * Fetch all favorite colleges of the authenticated user
 */
export const getFavorites = async (token) => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch favorites');
  }
  return data;
};

/**
 * Check if a college is favorited by the current user
 */
export const checkFavorite = async (collegeId, token) => {
  const response = await fetch(`${BASE_URL}/check/${collegeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    return { is_favorite: false };
  }
  return data;
};
