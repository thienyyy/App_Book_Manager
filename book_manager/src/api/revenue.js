import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.3.5:3000/api'; // đổi thành IP nếu test trên device

// Lấy token từ storage
export const getToken = async () => {
  return await SecureStore.getItemAsync('token');
};

export const getRevenueOverview = async () => {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzRlYmNhM2Q4MTQ1ZWUzNzFhYWM5NCIsImlhdCI6MTc1Mjc3Mjc4NiwiZXhwIjoxNzUyNzczOTg2fQ.h-hSnPa4Ps-bIxCJE8jPQHHn6G3QNsYeF6DtOxkVM5c"; // Lấy token đúng từ storage

    const response = await axios.get(`${BASE_URL}/seller/revenue`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.success && response.data?.revenue) {
      const revenue = response.data.revenue;

      return {
        success: true,
        totalRevenue: revenue.totalRevenue || 0,
        orders: revenue.recentOrders || [],
      };
    } else {
      throw new Error(response.data?.message || 'Failed to fetch revenue');
    }
  } catch (error) {
    console.error('Revenue API error:', error.message);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Server error when fetching revenue'
    );
  }
};
