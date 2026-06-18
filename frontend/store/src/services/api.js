import axios from "axios";

const BASE = "http://localhost:8084";

// ── Auth ──────────────────────────────────────────────
export const signup = (data) =>
  axios.post(`${BASE}/auth/signup`, data);

export const login = (data) =>
  axios.post(`${BASE}/auth/login`, data);

// ── Image Upload ───────────────────────────────────────
// sends a FormData with field "file", returns the image URL string
export const uploadImage = (formData) =>
  axios.post(`${BASE}/upload/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ── Products ──────────────────────────────────────────
export const getProducts = () =>
  axios.get(`${BASE}/products`);

export const addProduct = (data) =>
  axios.post(`${BASE}/products`, data);

export const updateProduct = (id, data) =>
  axios.put(`${BASE}/products/${id}`, data);

export const deleteProduct = (id) =>
  axios.delete(`${BASE}/products/${id}`);

export const filterProducts = (category) =>
  axios.get(`${BASE}/products/filter?category=${encodeURIComponent(category)}`);

export const searchProducts = (name) =>
  axios.get(`${BASE}/products/search?name=${encodeURIComponent(name)}`);

// ── Orders ────────────────────────────────────────────
// place an order: { userId, customerName, items: [{productId, productName, productImage, price, quantity}] }
export const placeOrder = (data) =>
  axios.post(`${BASE}/orders`, data);

// get order history for a customer
export const getOrdersByUser = (userId) =>
  axios.get(`${BASE}/orders/user/${userId}`);
