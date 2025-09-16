// services/PaymentService.ts
import axios from 'axios';

// Payment Gateway Configuration
const PAYMENT_CONFIG = {
  API_BASE_URL: 'https://dev-vanilla.edviron.com/erp',
  PG_KEY: 'edvtest01',
  API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2fQ.IJWTYCOurGCFdRM2xyKtw6TEcuwXxGnmINrXFfs',
  SCHOOL_ID: '65b0e6293e9f76a9694d84b4',
  PG_SECRET_KEY: 'your_pg_secret_key_here' // This should be obtained from environment or secure config
};

interface CreatePaymentRequest {
  school_id: string;
  amount: string;
  callback_url: string;
  sign: string;
}

interface CreatePaymentResponse {
  collect_request_id: string;
  Collect_request_url: string;
  sign: string;
}

interface PaymentStatusRequest {
  collect_request_id: string;
  school_id: string;
  sign: string;
}

interface PaymentStatusResponse {
  status: string;
  amount: number;
  details: {
    payment_methods: any;
  };
  jwt: string;
}

// JWT Utility Functions
class JWTService {
  private static base64UrlEncode(obj: any): string {
    return btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private static createSignature(header: string, payload: string, secret: string): string {
    // In a real implementation, you would use a proper HMAC-SHA256 algorithm
    // For demo purposes, we'll create a simple signature
    // In production, use a library like 'crypto' or 'jsonwebtoken'
    const data = `${header}.${payload}`;
    
    // This is a simplified signature - in production use proper HMAC-SHA256
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return btoa(hash.toString()).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  static createJWT(payload: any, secret: string): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const encodedHeader = this.base64UrlEncode(header);
    const encodedPayload = this.base64UrlEncode(payload);
    const signature = this.createSignature(encodedHeader, encodedPayload, secret);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
}

export class PaymentService {
  private static createAxiosInstance() {
    return axios.create({
      baseURL: PAYMENT_CONFIG.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYMENT_CONFIG.API_KEY}`
      },
      timeout: 30000 // 30 seconds timeout
    });
  }

  /**
   * Create a payment collect request
   */
  static async createPayment(
    schoolId: string,
    amount: number,
    callbackUrl: string
  ): Promise<CreatePaymentResponse> {
    try {
      // Create JWT payload for signing
      const jwtPayload = {
        school_id: schoolId,
        amount: amount.toString(),
        callback_url: callbackUrl
      };

      // Generate JWT signature
      const jwtSign = JWTService.createJWT(jwtPayload, PAYMENT_CONFIG.PG_SECRET_KEY);

      // Prepare request body
      const requestBody: CreatePaymentRequest = {
        school_id: schoolId,
        amount: amount.toString(),
        callback_url: callbackUrl,
        sign: jwtSign
      };

      console.log('Creating payment request:', requestBody);

      const api = this.createAxiosInstance();
      const response = await api.post<CreatePaymentResponse>('/create-collect-request', requestBody);

      console.log('Payment creation response:', response.data);
      return response.data;

    } catch (error) {
      console.error('Payment creation error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message || 'Payment creation failed';
        throw new Error(`Payment API Error: ${errorMessage}`);
      }
      
      throw new Error('Network error occurred while creating payment');
    }
  }

  /**
   * Check payment status
   */
  static async checkPaymentStatus(
    collectRequestId: string,
    schoolId: string
  ): Promise<PaymentStatusResponse> {
    try {
      // Create JWT payload for status check
      const jwtPayload = {
        school_id: schoolId,
        collect_request_id: collectRequestId
      };

      // Generate JWT signature
      const jwtSign = JWTService.createJWT(jwtPayload, PAYMENT_CONFIG.PG_SECRET_KEY);

      const api = this.createAxiosInstance();
      const response = await api.get<PaymentStatusResponse>(
        `/collect-request/${collectRequestId}`,
        {
          params: {
            school_id: schoolId,
            sign: jwtSign
          }
        }
      );

      console.log('Payment status response:', response.data);
      return response.data;

    } catch (error) {
      console.error('Payment status check error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message || 'Status check failed';
        throw new Error(`Payment Status API Error: ${errorMessage}`);
      }
      
      throw new Error('Network error occurred while checking payment status');
    }
  }

  /**
   * Get default configuration
   */
  static getConfig() {
    return {
      PG_KEY: PAYMENT_CONFIG.PG_KEY,
      SCHOOL_ID: PAYMENT_CONFIG.SCHOOL_ID,
      API_BASE_URL: PAYMENT_CONFIG.API_BASE_URL
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