import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token) => {
    console.log('[DEBUG] Bắt đầu login với token:', token);
    await AsyncStorage.setItem('token', token);
    try {
      const res = await getProfile();
      console.log('[DEBUG] Login thành công, user:', res.data);
      setUser(res.data);
    } catch (e) {
      console.log('[DEBUG] Login thất bại:', e.message);
      setUser(null);
    }
  };

  const logout = async () => {
    console.log('[DEBUG] Logout - clear AsyncStorage');
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  const loadProfile = async () => {
    console.log('[DEBUG] Bắt đầu loadProfile');
    try {
      const res = await getProfile();
      console.log('[DEBUG] loadProfile thành công:', res.data);
      setUser(res.data);
    } catch (e) {
      console.log('[DEBUG] loadProfile thất bại:', e.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
