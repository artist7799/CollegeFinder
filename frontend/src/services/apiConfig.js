/**
 * Centralized API Base URL configuration
 * Dynamically uses environment variable if deployed (e.g. Vercel/Netlify),
 * or defaults to local Flask server during development.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
