import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../../config/api.config';

const api = axios.create({
  ...API_CONFIG,
});

// Add auth token to requests if it exists
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    location: string;
    dateOfBirth: string;
  }) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
};

export default api; 