import api from './api.js';

export const getOrders = async () => api.get('/orders');
export const getOrderDetails = async (id) => api.get(`/orders/${id}`);
export const createOrder = async (order) => api.post('/orders', order);
