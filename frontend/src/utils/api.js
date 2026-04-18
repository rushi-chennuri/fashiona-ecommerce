// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Create fetch wrapper with error handling
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/v1/products${queryString ? "?" + queryString : ""}`);
  },
  getById: (id) => apiFetch(`/v1/products/${id}`),
  getByCategory: (category) => apiFetch(`/v1/products?category=${encodeURIComponent(category)}`),
  search: (query) => apiFetch(`/v1/products?search=${encodeURIComponent(query)}`),
  getFeatured: (limit = 12) => apiFetch(`/v1/products/featured?limit=${limit}`),
  getBestSellers: (limit = 12) => apiFetch(`/v1/products/best-sellers?limit=${limit}`),
  getNewArrivals: (limit = 12) => apiFetch(`/v1/products/new-arrivals?limit=${limit}`),
  getRelated: (id, limit = 4) => apiFetch(`/v1/products/${id}/related?limit=${limit}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiFetch("/v1/products/categories"),
  getById: (id) => apiFetch(`/v1/categories/${id}`),
};

// Auth API
export const authAPI = {
  login: (email, password) =>
    apiFetch("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (userData) =>
    apiFetch("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};

// Cart API
export const cartAPI = {
  getCart: () => apiFetch("/v1/cart"),
  addItem: (productId, quantity = 1, size = "", color = "") =>
    apiFetch("/v1/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, size, color }),
    }),
  updateItem: (cartItemId, quantity) =>
    apiFetch(`/v1/cart/items/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),
  removeItem: (cartItemId) =>
    apiFetch(`/v1/cart/items/${cartItemId}`, { method: "DELETE" }),
  clearCart: () => apiFetch("/v1/cart", { method: "DELETE" }),
};

// Orders API
export const ordersAPI = {
  create: (orderData) =>
    apiFetch("/v1/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),
  getAll: () => apiFetch("/v1/orders"),
  getById: (id) => apiFetch(`/v1/orders/${id}`),
};

// Wishlist API
export const wishlistAPI = {
  getAll: () => apiFetch("/v1/users/me/wishlist"),
  add: (productId) =>
    apiFetch(`/v1/users/me/wishlist/${productId}`, {
      method: "POST",
    }),
  remove: (productId) =>
    apiFetch(`/v1/users/me/wishlist/${productId}`, { method: "DELETE" }),
};

// Reviews API
export const reviewsAPI = {
  getByProduct: (productId) => apiFetch(`/v1/reviews/product/${productId}`),
  create: (productId, reviewData) =>
    apiFetch(`/v1/reviews`, {
      method: "POST",
      body: JSON.stringify({ ...reviewData, productId }),
    }),
};

// Coupons API
export const couponsAPI = {
  validate: (code) =>
    apiFetch("/v1/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
};
