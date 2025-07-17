// src/api/book.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.2.15:3000/api/books',
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = ""; // dán token test
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getMyBooks = () => API.get('/mine');
export const getBookById = (id) => API.get(`/${id}`);
export const deleteBook = (id) => API.delete(`/${id}`);

export const addBook = (bookData) => {
  const form = new FormData();
  for (let key in bookData) {
    if (bookData[key]) form.append(key, bookData[key]);
  }
  return API.post('/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const editBook = (id, bookData) => {
  const form = new FormData();
  for (let key in bookData) {
    if (bookData[key]) form.append(key, bookData[key]);
  }
  return API.put(`/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
