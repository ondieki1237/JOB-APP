import axios from 'axios';
import { API_URL } from '@/app/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const messageService = {
  getMessages: async (jobId: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/api/messages/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  sendMessage: async (jobId: string, receiverId: string, content: string, type: 'text' | 'image' = 'text', file?: FormData) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': file ? 'multipart/form-data' : 'application/json',
      };

      const data = file || { jobId, receiverId, content, type };
      
      const response = await axios.post(`${API_URL}/api/messages/send`, data, { headers });
      return response.data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  markAsRead: async (messageId: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.patch(
        `${API_URL}/api/messages/${messageId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
}; 