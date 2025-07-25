import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token, fallbackUser = null) => {
    console.log("[DEBUG] Bắt đầu login với token:", token);
    await AsyncStorage.setItem("authToken", token);
    try {
      const res = await getProfile();
      const userObj = res.data?.data || res.data;
      console.log("[DEBUG] Login thành công, user:", userObj);

      if (!userObj?.role) {
        console.warn("[⚠️ WARNING] Không có role trong userObj sau login!");
      }

      setUser(userObj);

      if (userObj?._id) {
        await AsyncStorage.setItem("userId", userObj._id);
        console.log("[DEBUG] Đã lưu userId sau login:", userObj._id);
      }

    } catch (e) {
      console.log("[DEBUG] Login thất bại:", e.message);
      if (fallbackUser) {
        console.log("[DEBUG] setUser từ fallbackUser:", fallbackUser);
        setUser(fallbackUser);

        if (fallbackUser._id) {
          await AsyncStorage.setItem("userId", fallbackUser._id);
          console.log("[DEBUG] Đã lưu fallback userId:", fallbackUser._id);
        }
      } else {
        setUser(null);
      }
    }
  };

  const logout = async () => {
    console.log("[DEBUG] Logout - clear AsyncStorage");
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userId");
    setUser(null);
  };

  const loadProfile = async (fallbackUser = null) => {
    console.log("[DEBUG] Bắt đầu loadProfile");
    try {
      const res = await getProfile();
      const userObj = res.data?.data || res.data;
      console.log("[DEBUG] loadProfile thành công:", userObj);

      if (!userObj?.role) {
        console.warn("[⚠️ WARNING] Không có role trong userObj sau loadProfile!");
      }

      setUser(userObj);

      if (userObj?._id) {
        await AsyncStorage.setItem("userId", userObj._id);
        console.log("[DEBUG] Đã lưu userId sau loadProfile:", userObj._id);
      }


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
