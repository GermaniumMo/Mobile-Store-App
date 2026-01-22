import api from './client.js';

export const getCart = async () => api.get('/cart');
export const addToCart = async (item) => api.post('/cart/add', item);
export const updateCart = async (cart) => api.put('/cart/update', cart);
export const removeCartItem = async (itemId) => api.delete(`/cart/remove/${itemId}`);
export const clearCart = async () => api.post('/cart/clear');
