import axios from "axios";
import { getToken } from "../../src/utils/tokenStorage";

// Cấu hình API Base URL

const API_BASE_URL = "http://192.168.2.3:3000/api"; // Thay bằng URL thật (Backend)
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động gắn token cho mỗi request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("API Error:", error.response.data.message);
    } else {
      console.log("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
