import axios from './axiosInstance';

export const loginAPI = (data) => axios.post('/auth/login', data);
export const registerAPI = (data) => axios.post('/auth/register', data);
export const getProfile = () => axios.get('/users/me');
export const updateProfile = (data) => axios.put('/users/me', data);
export const changePassword = (data) => axios.put('/users/me/password', data);


