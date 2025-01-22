import { api } from './api';

export const financeService = {
  getFinanceDetails: async () => {
    try {
      const response = await api.get('/finance/details');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching finance details:', error);
      throw error.response?.data || { message: 'Failed to fetch finance details' };
    }
  },

  addTransaction: async (transactionData: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category: string;
  }) => {
    try {
      const response = await api.post('/finance/transaction', transactionData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to add transaction' };
    }
  },

  addPaymentMethod: async (paymentData: {
    type: string;
    details: any;
    isDefault: boolean;
  }) => {
    try {
      const response = await api.post('/finance/payment-method', paymentData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to add payment method' };
    }
  }
}; 