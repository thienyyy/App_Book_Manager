import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({

  baseURL: "http://192.168.2.3:3000/api", // đổi IP nếu cần

});

// Thêm token vào header trước mỗi request
axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
