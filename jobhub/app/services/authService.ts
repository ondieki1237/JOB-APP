import axios from 'axios';
import API_CONFIG from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

interface SignupData {
  username: string;
  email: string;
  password: string;
  role: 'job_seeker' | 'employer';
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  signup: async (data: SignupData) => {
    try {
      console.log('Sending signup request with data:', data); // Log outgoing request
      const response = await api.post('/auth/signup', data);
      console.log('Signup response:', response.data); // Log response
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Signup failed' };
    }
  },

  login: async (data: LoginData) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
}; 