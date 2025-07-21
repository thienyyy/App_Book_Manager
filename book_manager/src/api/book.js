// src/api/book.js
import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const API = axios.create({
  baseURL: 'http://172.16.40.35:3000/api/',
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzRlYmNhM2Q4MTQ1ZWUzNzFhYWM5NCIsImlhdCI6MTc1MzEwNzIzMiwiZXhwIjoxNzUzMTA4NDMyfQ.EEjt08cxgBdH7XnZE-R2voDl22pbABcH6wdQwSz44Ko";
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getMyBooks = () => API.get('/books/mine');
export const getBookById = (id) => API.get(`/books/${id}`);
export const createBook = async (book) => {
  const res = await API.post('/books', book);
  return res.data;
};
export const updateBook = (id, book) => API.put(`/books/${id}`, book);
export const deleteBook = (id) => API.delete(`/books/${id}`);