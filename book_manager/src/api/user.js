import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.3.5:3000/api/users',
  timeout: 10000,
});

// ✅ Gắn token test tạm thời (có thể thay bằng getToken() từ AsyncStorage nếu cần động)
API.interceptors.request.use(async (config) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzRlYmNhM2Q4MTQ1ZWUzNzFhYWM5NCIsImlhdCI6MTc1Mjc3Mjc4NiwiZXhwIjoxNzUyNzczOTg2fQ.h-hSnPa4Ps-bIxCJE8jPQHHn6G3QNsYeF6DtOxkVM5c"; // ⬅️ Gắn token cố định
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ GET all users ()
export const getAllUsers = ({ page = 1, limit = 10 } = {}) => {
  return API.get(`/?page=${page}&limit=${limit}`).then(res => res.data);
};


// ✅ GET profile người dùng hiện tại
export const getProfile = () =>
  API.get('/me').then(res => res.data);

/*// ✅ PUT update profile (có ảnh → multipart/form-data)
export const updateProfile = (data) => {
  const form = new FormData();
  for (let key in data) {
    if (data[key]) {
      form.append(key, data[key]);
    }
  }
  return API.put('/me', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);
};*/
export const updateProfile = (data) => {
  return API.put('/me', data).then(res => res.data);
};


// ✅ DELETE user theo ID (tuỳ quyền)
export const deleteUserById = (id) =>
  API.delete(`/${id}`).then(res => res.data);
