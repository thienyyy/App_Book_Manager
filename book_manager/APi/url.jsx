import axios from "axios";

// Cấu hình API Base URL
const API_BASE_URL = "http://192.168.75.1:3000/api"; // Thay bằng URL thật (Backend)

// Hàm lấy token từ AsyncStorage (nếu bạn dùng đăng nhập)
// import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2UwNDI0MzBhNmQ3OWNmODllNGI3NSIsImlhdCI6MTc1MzE0MjY4NCwiZXhwIjoxNzUzMTQzODg0fQ.iXEnYv0Ri9pH0lzuc_Nk9_z51-0xpmVWDtEATKuYnH0";
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
