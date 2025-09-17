// frontend/src/services/PaymentService.ts
import axios from 'axios';

const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  TIMEOUT: 30000
};

interface CreatePaymentRequest {
  school_id: string;
  student_info: {
    name: string;
    id: string;
    email: string;
    phone: string;
  };
  order_amount: number;
  gateway_name: string;
  fee_type: string;
  description: string;
  due_date: string;
  callback_url: string;
  redirect_url: string;
}

interface PaymentResponse {
  success: boolean;
  order_id?: string;
  collect_request_id?: string;
  payment_url?: string;
  message?: string;
  error?: string;
}

interface PaymentStatusResponse {
  success: boolean;
  data?: {
    status: string;
    amount: number;
    details: any;
    jwt: string;
  };
  message?: string;
  error?: string;
}

// Create axios instance with authentication
const createApiInstance = () => {
  const token = localStorage.getItem('auth_token'); // Adjust based on your auth implementation
  
  return axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined
    }
  });
};

export class PaymentService {
  /**
   * Create payment request via your backend
   */
  static async createPayment(
    schoolId: string,
    amount: number,
    studentInfo: {
      name: string;
      id: string;
      email: string;
      phone: string;
    },
    feeType: string,
    description: string,
    dueDate: string
  ): Promise<PaymentResponse> {
    try {
      console.log('Creating payment via backend...');
      
      const callbackUrl = this.formatCallbackUrl(window.location.origin);
      const redirectUrl = this.formatRedirectUrl(window.location.origin);
      
      const requestData: CreatePaymentRequest = {
        school_id: schoolId,
        student_info: studentInfo,
        order_amount: amount,
        gateway_name: 'PhonePe',
        fee_type: feeType,
        description: description,
        due_date: dueDate,
        callback_url: callbackUrl,
        redirect_url: redirectUrl
      };

      console.log('Payment request data:', requestData);

      const api = createApiInstance();
      const response = await api.post<PaymentResponse>('/api/payments/create-payment', requestData);

      console.log('Payment creation response:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('Payment creation error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        return {
          success: false,
          error: errorData?.message || error.message || 'Payment creation failed',
          message: errorData?.error || 'Unknown error occurred'
        };
      }
      
      return {
        success: false,
        error: 'Network error occurred',
        message: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Check payment status via your backend
   */
  static async checkPaymentStatus(
    collectRequestId: string,
    schoolId: string
  ): Promise<PaymentStatusResponse> {
    try {
      console.log('Checking payment status via backend...');
      
      const api = createApiInstance();
      const response = await api.get<PaymentStatusResponse>(
        `/api/payments/status/${collectRequestId}`,
        {
          params: { school_id: schoolId }
        }
      );

      console.log('Payment status response:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('Payment status check error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        return {
          success: false,
          error: errorData?.message || error.message || 'Status check failed',
          message: errorData?.error || 'Unknown error occurred'
        };
      }
      
      return {
        success: false,
        error: 'Network error occurred',
        message: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Get all transactions via your backend
   */
  static async getAllTransactions(): Promise<any> {
    try {
      console.log('Fetching all transactions via backend...');
      
      const api = createApiInstance();
      const response = await api.get('/api/payments/transactions');

      console.log('Transactions response:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('Fetch transactions error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        throw new Error(errorData?.message || error.message || 'Failed to fetch transactions');
      }
      
      throw new Error(error.message || 'Network error occurred');
    }
  }

  /**
   * Get transactions by school ID via your backend
   */
  static async getTransactionsBySchool(schoolId: string): Promise<any> {
    try {
      console.log('Fetching school transactions via backend...');
      
      const api = createApiInstance();
      const response = await api.get(`/api/payments/transactions/school/${schoolId}`);

      console.log('School transactions response:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('Fetch school transactions error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        throw new Error(errorData?.message || error.message || 'Failed to fetch school transactions');
      }
      
      throw new Error(error.message || 'Network error occurred');
    }
  }

  /**
   * Health check for backend payment service
   */
  static async healthCheck(): Promise<any> {
    try {
      const api = createApiInstance();
      const response = await api.get('/api/payments/health');
      return response.data;
    } catch (error: any) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  /**
   * Get default configuration
   */
  static getConfig() {
    return {
      PG_KEY: 'edvtest01',
      SCHOOL_ID: '65b0e6293e9f76a9694d84b4',
      BACKEND_URL: API_CONFIG.BASE_URL
    };
  }

  /**
   * Validate payment amount
   */
  static validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 100000 && Number.isFinite(amount);
  }

  /**
   * Format callback URL
   */
  static formatCallbackUrl(baseUrl: string, collectId?: string): string {
    const url = new URL('/dashboard/payment-callback', baseUrl);
    if (collectId) {
      url.searchParams.set('collect_id', collectId);
    }
    return url.toString();
  }

  /**
   * Format redirect URL
   */
  static formatRedirectUrl(baseUrl: string): string {
    return new URL('/dashboard/transactions', baseUrl).toString();
  }
}