// src/api/book.js
import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const API = axios.create({
  baseURL: 'http://192.168.3.5:3000/api/',
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzRlYmNhM2Q4MTQ1ZWUzNzFhYWM5NCIsImlhdCI6MTc1Mjc3NjM3MiwiZXhwIjoxNzUyNzc3NTcyfQ.zQcIElG4CmK5SHNnGMtqtoVbGZR846DplMA6zqq7gOI";
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getMyBooks = () => API.get('/books/mine');
export const getBookById = (id) => API.get(`/books/${id}`);
export const createBook = (book) => API.post('/books', book);
export const updateBook = (id, book) => API.put(`/books/${id}`, book);
export const deleteBook = (id) => API.delete(`/books/${id}`);