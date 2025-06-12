// src/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://tfg-3nln.onrender.com';
console.log('✅ api.js cargado, baseURL:', API_URL);

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('🏷️ api interceptor: token =', token);
  if (token) {
    // Aquí corregimos la sintaxis para que JS entienda el template‐literal
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
