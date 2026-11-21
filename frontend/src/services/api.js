import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const API = axios.create({
  baseURL: BASE_URL,
});

export const fetchProducts = () => API.get('/products');

export const uploadProduct = (formData) =>
  API.post('/products/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const verifyAdminPin = (pin) => API.post('/admin/login', { pin });

export const changeAdminPin = (oldPin, newPin) =>
  API.post('/admin/change-pin', { oldPin, newPin });

export const fetchSales = () => API.get('/admin/sales');

export const addSaleRecord = (saleData) => API.post('/admin/sales', saleData);

export const deleteSaleRecord = (id) => API.delete(`/admin/sales/${id}`);