// src/api/book.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from '../utils/tokenStorage';

const API = axios.create({
  baseURL: 'http://172.16.40.35:3000/api/',
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = await getToken();
  console.log('[DEBUG] Interceptor token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

export const getMyBooks = () => API.get('/books/mine');
export const getBookById = (id) => API.get(`/books/${id}`);
export const createBook = async (book) => {
  console.log('[DEBUG] createBook called with FormData:', book);
  try {
    const res = await API.post('/books', book, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('[DEBUG] createBook response:', res.data);
    return res.data;
  } catch (error) {
    console.error('[DEBUG] createBook error:', error.message, error.config, error.response?.data);
    throw error;
  }
};
export const updateBook = (id, book) => API.put(`/books/${id}`, book);
export const deleteBook = (id) => API.delete(`/books/${id}`);