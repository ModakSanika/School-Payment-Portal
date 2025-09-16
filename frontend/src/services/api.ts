import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, AUTH_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { storage } from '../utils/helpers';
import type { ApiResponse } from '../types';

// Create a WeakMap to store request timing data
const requestTimings = new WeakMap<AxiosRequestConfig, Date>();

// Create axios instance with base configuration
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = storage.get<string>(AUTH_CONFIG.TOKEN_KEY);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Store request start time for debugging
      requestTimings.set(config, new Date());
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for global error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response time in development
      if (import.meta.env.DEV) {
        const endTime = new Date();
        const startTime = requestTimings.get(response.config);
        if (startTime) {
          const duration = endTime.getTime() - startTime.getTime();
          console.log(`API Call: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
          // Clean up the timing data
          requestTimings.delete(response.config);
        }
      }
      
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Clean up timing data if it exists
      if (originalRequest) {
        requestTimings.delete(originalRequest);
      }

      // Handle network errors
      if (!error.response) {
        console.error('Network Error:', error.message);
        return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
      }

      const { status, data } = error.response;

      // Handle specific HTTP status codes
      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          storage.remove(AUTH_CONFIG.TOKEN_KEY);
          storage.remove(AUTH_CONFIG.USER_KEY);
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          
          return Promise.reject(new Error(data?.message || ERROR_MESSAGES.UNAUTHORIZED));

        case 403:
          return Promise.reject(new Error(data?.message || ERROR_MESSAGES.FORBIDDEN));

        case 404:
          return Promise.reject(new Error(data?.message || ERROR_MESSAGES.NOT_FOUND));

        case 422:
          return Promise.reject(new Error(data?.message || ERROR_MESSAGES.VALIDATION_ERROR));

        case 500:
        case 502:
        case 503:
        case 504:
          return Promise.reject(new Error(data?.message || ERROR_MESSAGES.SERVER_ERROR));

        default:
          return Promise.reject(new Error(data?.message || ERROR_MESSAGES.GENERIC_ERROR));
      }
    }
  );

  return instance;
};

// Create the main API instance
export const api = createApiInstance();

// API wrapper class for better organization
export class ApiService {
  private static instance: ApiService;
  private apiInstance: AxiosInstance;

  private constructor() {
    this.apiInstance = api;
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Generic request method
  private async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.apiInstance.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // GET request
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  // POST request
  public async post<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  // PUT request
  public async put<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  // PATCH request
  public async patch<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  // DELETE request
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Upload file
  public async upload<T = any>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Download file
  public async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.apiInstance.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }

  // Update token
  public updateToken(token: string): void {
    storage.set(AUTH_CONFIG.TOKEN_KEY, token);
  }

  // Clear token
  public clearToken(): void {
    storage.remove(AUTH_CONFIG.TOKEN_KEY);
    storage.remove(AUTH_CONFIG.USER_KEY);
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();

// Utility function to handle API errors in components
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return ERROR_MESSAGES.GENERIC_ERROR;
};

// Retry logic for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries = API_CONFIG.RETRY_ATTEMPTS,
  delay = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries) {
        // Exponential backoff
        const waitTime = delay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
};

// Request cancellation support
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

export const isCancelledRequest = (error: any): boolean => {
  return axios.isCancel(error);
};

// Default export
export default apiService;