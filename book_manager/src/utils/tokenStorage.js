import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (e) {
    console.error('Failed to store token', e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (e) {
    console.error('Failed to read token', e);
    return null;
  }
};
