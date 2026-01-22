import api from './client.js';

export const getProducts = async () => api.get('/products');
export const getFeaturedProducts = async () => api.get('/products/featured');
export const getIOSProducts = async () => api.get('/products/ios');
export const getAndroidProducts = async () => api.get('/products/android');
export const searchProducts = async (query) => api.get('/products/search', { params: { q: query } });
export const getProductDetails = async (id) => api.get(`/products/${id}`);
export const getProductReviews = async (id) => api.get(`/products/${id}/reviews`);
