import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../APi/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token, fallbackUser = null) => {
    console.log("[DEBUG] Bắt đầu login với token:", token);
    await AsyncStorage.setItem("authToken", token);
    try {
      const res = await getProfile();
      // Nếu API trả về { data: user } thì lấy res.data.data.user, nếu trả về user thì lấy res.data
      const userObj = res.data?.data?.user || res.data?.user || res.data;
      console.log("[DEBUG] Login thành công, user:", userObj);
      setUser(userObj);
    } catch (e) {
      console.log("[DEBUG] Login thất bại:", e.message);
      if (fallbackUser) {
        console.log("[DEBUG] setUser từ fallbackUser:", fallbackUser);
        setUser(fallbackUser);
      } else {
        setUser(null);
      }
    }
  };

  const logout = async () => {
    console.log("[DEBUG] Logout - clear AsyncStorage");
    await AsyncStorage.removeItem("authToken");
    setUser(null);
  };

  const loadProfile = async (fallbackUser = null) => {
    console.log("[DEBUG] Bắt đầu loadProfile");
    try {
      const res = await getProfile();
      console.log(res);

      const userObj = res.data?.data?.user || res.data?.user || res.data;

      console.log("[DEBUG] loadProfile thành công:", userObj);
      setUser(userObj.data);
    } catch (e) {
      console.log("[DEBUG] loadProfile thất bại:", e.message);
      if (fallbackUser) {
        console.log("[DEBUG] setUser từ fallbackUser:", fallbackUser);
        setUser(fallbackUser);
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, loadProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
