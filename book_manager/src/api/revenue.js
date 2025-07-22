import axios from 'axios';

// Token test lấy từ Postman (gắn trực tiếp):
const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzRlYmNhM2Q4MTQ1ZWUzNzFhYWM5NCIsImlhdCI6MTc1MzEwNzIzMiwiZXhwIjoxNzUzMTA4NDMyfQ.EEjt08cxgBdH7XnZE-R2voDl22pbABcH6wdQwSz44Ko';

const API_BASE_URL = 'http://172.16.40.35:3000/api/seller';

// 📊 Lấy tổng quan doanh thu seller
export const getOverviewRevenue = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/revenue`, {
      headers: {
        Authorization: HARDCODED_TOKEN,
      },
    });
    // res.data = { totalRevenue, totalBooksSold, ... }
    return res.data;
  } catch (error) {
    console.error('Lỗi lấy doanh thu tổng quan:', error.message);
    throw error;
  }
};

// 📚 Lấy danh sách doanh thu theo từng sách
export const getBookRevenueList = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/revenue/books`, {
      headers: {
        Authorization: HARDCODED_TOKEN,
      },
    });
    // res.data = { bookStats: [...] }
    return res.data.bookStats;
  } catch (error) {
    console.error('Lỗi lấy doanh thu từng sách:', error.message);
    throw error;
  }
};
