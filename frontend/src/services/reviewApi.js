import { API_BASE_URL } from './apiConfig';

const BASE_URL = API_BASE_URL;


/**
 * Fetch all reviews and review summary for a college
 */
export const getCollegeReviews = async (collegeId) => {
  const response = await fetch(`${BASE_URL}/colleges/${collegeId}/reviews`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to load reviews');
  }
  return data;
};

/**
 * Submit a new review for a college (Requires JWT)
 */
export const createReview = async (collegeId, reviewData, token) => {
  const response = await fetch(`${BASE_URL}/colleges/${collegeId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reviewData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit review');
  }
  return data;
};

/**
 * Update an existing review (Requires JWT + Ownership)
 */
export const updateReview = async (reviewId, reviewData, token) => {
  const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reviewData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update review');
  }
  return data;
};

/**
 * Delete an existing review (Requires JWT + Ownership)
 */
export const deleteReview = async (reviewId, token) => {
  const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete review');
  }
  return data;
};
