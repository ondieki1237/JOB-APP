import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/app/config';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface JobData {
  title: string;
  description: string;
  skillsRequired: string[];
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  locationName: string;
  budget: {
    min: number;
    max: number;
  };
  duration: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Fixed';
}

// Add error types
interface ApiError extends Error {
  response?: {
    data?: any;
    status?: number;
  };
}

export const jobService = {
  // Get all jobs with optional filters
  getJobs: async ({ search = '', status = [] } = {}) => {
    try {
      const response = await api.get('/api/jobs', {
        params: { search, status },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Get a single job by ID
  getJobById: async (id: string) => {
    try {
      const response = await api.get(`/api/jobs/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching job details:', error);
      if (error.response?.status === 404) {
        throw new Error('Job not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch job details');
    }
  },

  // Create a new job
  createJob: async (jobData: any) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.post('/jobs/create', jobData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error in createJob:', {
        response: error.response?.data,
        status: error.response?.status,
        error: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Please login to post a job');
      }
      
      throw error.response?.data || { message: 'Failed to create job' };
    }
  },

  // Apply for a job
  applyForJob: async (jobId: string, applicationData: { applicationMessage: string; rate: number }) => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to apply for job' };
    }
  }
}; 