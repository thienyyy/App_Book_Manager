// src/api/revenue.js
import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const API = axios.create({
  baseURL: 'http://172.16.43.89:3000/api/',
  timeout: 10000,
});

// Gắn token tự động vào request
API.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Gọi API thống kê rating và favorite
export const getRatingStats = async () => {
  try {
    const res = await API.get('/seller/revenue/rating-stats');
    return res.data.ratingStats; // dữ liệu chính nằm trong res.data.ratingStats
  } catch (error) {
    console.error('[DEBUG] getRatingStats error:', error.message, error.response?.data);
    throw error;
  }
};

// 2. Gọi API phân tích hiệu suất sách
export const getPerformanceAnalysis = async () => {
  try {
    const res = await API.get('/seller/revenue/performance-analysis');
    return res.data.analysis; // dữ liệu chính nằm trong res.data.analysis
  } catch (error) {
    console.error('[DEBUG] getPerformanceAnalysis error:', error.message, error.response?.data);
    throw error;
  }
};
