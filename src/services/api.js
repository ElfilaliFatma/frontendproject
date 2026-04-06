import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_BASE });

// Categories
export const categorieService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Fournisseurs
export const fournisseurService = {
  getAll: () => api.get('/fournisseurs'),
  getById: (id) => api.get(`/fournisseurs/${id}`),
  create: (data) => api.post('/fournisseurs', data),
  update: (id, data) => api.put(`/fournisseurs/${id}`, data),
  delete: (id) => api.delete(`/fournisseurs/${id}`),
};

// Produits
export const produitService = {
  getAll: () => api.get('/produits'),
  getById: (id) => api.get(`/produits/${id}`),
  create: (data) => api.post('/produits', data),
  update: (id, data) => api.put(`/produits/${id}`, data),
  delete: (id) => api.delete(`/produits/${id}`),
};
