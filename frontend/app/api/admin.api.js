import api from './client.js';

// Products
export const adminGetProducts = async () => api.get('/admin/products');
export const adminCreateProduct = async (data) => api.post('/admin/products', data);
export const adminUpdateProduct = async (id, data) => api.put(`/admin/products/${id}`, data);
export const adminDeleteProduct = async (id) => api.delete(`/admin/products/${id}`);

// Categories
export const adminGetCategories = async () => api.get('/admin/categories');
export const adminCreateCategory = async (data) => api.post('/admin/categories', data);
export const adminUpdateCategory = async (id, data) => api.put(`/admin/categories/${id}`, data);
export const adminDeleteCategory = async (id) => api.delete(`/admin/categories/${id}`);

// Brands
export const adminGetBrands = async () => api.get('/admin/brands');
export const adminCreateBrand = async (data) => api.post('/admin/brands', data);
export const adminUpdateBrand = async (id, data) => api.put(`/admin/brands/${id}`, data);
export const adminDeleteBrand = async (id) => api.delete(`/admin/brands/${id}`);

// Orders
export const adminGetOrders = async () => api.get('/admin/orders');
export const adminGetOrderDetails = async (id) => api.get(`/admin/orders/${id}`);
export const adminUpdateOrder = async (id, data) => api.put(`/admin/orders/${id}`, data);
export const adminDeleteOrder = async (id) => api.delete(`/admin/orders/${id}`);
