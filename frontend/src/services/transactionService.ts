import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { buildQueryString } from '../utils/helpers';
import type { 
  Transaction, 
  PaymentRequest, 
  PaymentResponse, 
  TransactionFilters, 
  QueryParams,
  PaginatedResponse,
  ApiResponse
} from '../types';

export class TransactionService {
  private static instance: TransactionService;

  private constructor() {}

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  /**
   * Get all transactions with pagination and filters
   */
  public async getAllTransactions(filters: TransactionFilters = {}): Promise<PaginatedResponse<Transaction>> {
    try {
      // Build query string from filters
      const queryParams: Record<string, string> = {};
      
      if (filters.status) {
        queryParams.status = Array.isArray(filters.status) 
          ? filters.status.join(',') 
          : filters.status;
      }
      if (filters.school_id) {
        queryParams.school_id = Array.isArray(filters.school_id) 
          ? filters.school_id.join(',') 
          : filters.school_id;
      }
      if (filters.gateway) {
        queryParams.gateway = Array.isArray(filters.gateway) 
          ? filters.gateway.join(',') 
          : filters.gateway;
      }
      if (filters.date_from) queryParams.date_from = filters.date_from;
      if (filters.date_to) queryParams.date_to = filters.date_to;
      if (filters.search) queryParams.search = filters.search;

      const queryString = Object.keys(queryParams).length > 0 
        ? '?' + new URLSearchParams(queryParams).toString()
        : '';
      
      const url = `${API_ENDPOINTS.TRANSACTIONS}${queryString}`;
      const response = await apiService.get<PaginatedResponse<Transaction>['data']>(url);

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }

      throw new Error(response.message || 'Failed to fetch transactions');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch transactions');
    }
  }

  /**
   * Get transactions for a specific school
   */
  public async getSchoolTransactions(
    schoolId: string, 
    filters: TransactionFilters = {}
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const queryParams: Record<string, string> = {};
      
      if (filters.status) queryParams.status = String(filters.status);
      if (filters.date_from) queryParams.date_from = filters.date_from;
      if (filters.date_to) queryParams.date_to = filters.date_to;
      if (filters.search) queryParams.search = filters.search;

      const queryString = Object.keys(queryParams).length > 0 
        ? '?' + new URLSearchParams(queryParams).toString()
        : '';
      
      const url = `${API_ENDPOINTS.TRANSACTION_BY_SCHOOL}/${schoolId}${queryString}`;
      const response = await apiService.get<PaginatedResponse<Transaction>['data']>(url);

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }

      throw new Error(response.message || 'Failed to fetch school transactions');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch school transactions');
    }
  }

  /**
   * Get transaction status by custom order ID
   */
  public async getTransactionStatus(customOrderId: string): Promise<Transaction> {
    try {
      const response = await apiService.get<Transaction>(
        `${API_ENDPOINTS.TRANSACTION_STATUS}/${customOrderId}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Transaction not found');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch transaction status');
    }
  }

  /**
   * Create a new payment request
   */
  public async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await apiService.post<PaymentResponse>(
        API_ENDPOINTS.CREATE_PAYMENT,
        paymentData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to create payment');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create payment');
    }
  }

  /**
   * Get transaction details by collect ID
   */
  public async getTransactionById(collectId: string): Promise<Transaction> {
    try {
      const response = await apiService.get<Transaction>(
        `${API_ENDPOINTS.TRANSACTIONS}/${collectId}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Transaction not found');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch transaction');
    }
  }

  /**
   * Search transactions
   */
  public async searchTransactions(
    query: string,
    filters: TransactionFilters = {}
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const searchFilters = {
        ...filters,
        search: query
      };

      return this.getAllTransactions(searchFilters);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to search transactions');
    }
  }

  /**
   * Validate payment request data
   */
  public validatePaymentRequest(data: PaymentRequest): string[] {
    const errors: string[] = [];

    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!data.student_info.name) {
      errors.push('Student name is required');
    }

    if (!data.student_info.id) {
      errors.push('Student ID is required');
    }

    if (!data.student_info.email) {
      errors.push('Student email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.student_info.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.gateway_name) {
      errors.push('Payment gateway is required');
    }

    if (!data.school_id) {
      errors.push('School ID is required');
    }

    if (!data.trustee_id) {
      errors.push('Trustee ID is required');
    }

    return errors;
  }
}

// Export singleton instance
export const transactionService = TransactionService.getInstance();

// Export default
export default transactionService;