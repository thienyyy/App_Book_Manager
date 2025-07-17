// src/api/revenue.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.2.15:3000/api/seller',
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = ""; // dán token test
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getRevenue = () => API.get('/revenue');
