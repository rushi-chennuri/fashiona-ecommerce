import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = __DEV__
  ? 'http://10.0.2.2:8080/api/v1'   // Android emulator → localhost
  : 'https://api.fashiona.com/v1';   // Production

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message;
    console.error('[API Error]', msg);
    return Promise.reject(error);
  }
);

// ─── Products ────────────────────────────────────────────────
export const productAPI = {
  getAll:       (params) => api.get('/products', { params }),
  getById:      (id)     => api.get(`/products/${id}`),
  getBySlug:    (slug)   => api.get(`/products/slug/${slug}`),
  getFeatured:  (limit = 12) => api.get('/products/featured', { params: { limit } }),
  getBestSellers: (limit = 12) => api.get('/products/best-sellers', { params: { limit } }),
  getNewArrivals: (limit = 12) => api.get('/products/new-arrivals', { params: { limit } }),
  getRelated:   (id, limit = 4) => api.get(`/products/${id}/related`, { params: { limit } }),
  getCategories: () => api.get('/products/categories'),
  search: (params) => api.get('/products', { params }),
};

// ─── Auth ────────────────────────────────────────────────────
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  refresh:  ()     => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

// ─── Orders ──────────────────────────────────────────────────
export const orderAPI = {
  create:     (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getById:    (id)   => api.get(`/orders/${id}`),
  cancel:     (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
};

// ─── User ────────────────────────────────────────────────────
export const userAPI = {
  getProfile:    () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  getAddresses:  () => api.get('/users/me/addresses'),
  addAddress:    (data) => api.post('/users/me/addresses', data),
  deleteAddress: (id) => api.delete(`/users/me/addresses/${id}`),
};

export default api;
