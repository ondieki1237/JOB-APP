import api from './api';
import { Job } from '../types/job';

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}

interface JobFilters {
  search?: string;
  category?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export const jobsService = {
  async getJobs(filters: JobFilters = {}): Promise<JobsResponse> {
    try {
      const response = await api.get<JobsResponse>('/jobs', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
    }
  },

  async getJobById(id: string): Promise<Job> {
    try {
      const response = await api.get<Job>(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch job');
    }
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    try {
      const response = await api.post<Job>('/jobs', jobData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create job');
    }
  },
};