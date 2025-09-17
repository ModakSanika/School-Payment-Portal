// src/services/PaymentService.debug.ts
import axios, { AxiosRequestConfig } from 'axios';

const PAYMENT_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_PAYMENT_API_BASE_URL || 'https://dev-vanilla.edviron.com/erp',
  API_KEY: import.meta.env.VITE_PAYMENT_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2fQ.IJWTYCOurGCFdRM2xyKtw6TEcuwXxGnmINrXFfs',
  PG_KEY: import.meta.env.VITE_PG_KEY || 'edvtest01',
  SCHOOL_ID: import.meta.env.VITE_SCHOOL_ID || '65b0e6293e9f76a9694d84b4'
};

console.log('Debug Config:', {
  API_BASE_URL: PAYMENT_CONFIG.API_BASE_URL,
  API_KEY: PAYMENT_CONFIG.API_KEY ? '***' + PAYMENT_CONFIG.API_KEY.slice(-10) : 'NOT SET',
  PG_KEY: PAYMENT_CONFIG.PG_KEY,
  SCHOOL_ID: PAYMENT_CONFIG.SCHOOL_ID
});

// Simple JWT creation (for testing only)
function createSimpleJWT(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // Simple signature (not secure, just for testing)
  const signature = btoa(`${encodedHeader}.${encodedPayload}`)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export class DebugPaymentService {
  /**
   * Test API connectivity
   */
  static async testConnection(): Promise<boolean> {
    try {
      console.log('Testing API connection...');
      
      const response = await fetch(PAYMENT_CONFIG.API_BASE_URL, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin
        }
      });
      
      console.log('Connection test response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Create payment with detailed logging
   */
  static async createPayment(
    schoolId: string,
    amount: number,
    callbackUrl: string
  ): Promise<any> {
    try {
      console.log('Starting payment creation...');
      console.log('Input data:', { schoolId, amount, callbackUrl });

      // Create JWT payload
      const jwtPayload = {
        school_id: schoolId,
        amount: amount.toString(),
        callback_url: callbackUrl
      };
      console.log('JWT Payload:', jwtPayload);

      // Create simple JWT
      const jwtSign = createSimpleJWT(jwtPayload);
      console.log('JWT Sign:', jwtSign.substring(0, 50) + '...');

      // Create request body
      const requestBody = {
        school_id: schoolId,
        amount: amount.toString(),
        callback_url: callbackUrl,
        sign: jwtSign
      };
      console.log('Request Body:', requestBody);

      // Create axios config
      const axiosConfig: AxiosRequestConfig = {
        baseURL: PAYMENT_CONFIG.API_BASE_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PAYMENT_CONFIG.API_KEY}`,
          'Accept': 'application/json',
          'Origin': window.location.origin
        }
      };

      console.log('Axios Config:', {
        baseURL: axiosConfig.baseURL,
        timeout: axiosConfig.timeout,
        headers: {
          ...axiosConfig.headers,
          'Authorization': 'Bearer ***' + PAYMENT_CONFIG.API_KEY.slice(-10)
        }
      });

      const api = axios.create(axiosConfig);

      // Add request interceptor
      api.interceptors.request.use(
        (config) => {
          const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
          console.log('Making request to:', fullUrl);
          console.log('Request method:', config.method?.toUpperCase());
          console.log('Request headers:', config.headers);
          console.log('Request data:', config.data);
          return config;
        },
        (error) => {
          console.error('Request interceptor error:', error);
          return Promise.reject(error);
        }
      );

      // Add response interceptor
      api.interceptors.response.use(
        (response) => {
          console.log('Response received:', response.status, response.statusText);
          console.log('Response headers:', response.headers);
          console.log('Response data:', response.data);
          return response;
        },
        (error) => {
          console.error('Response interceptor error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
          });
          return Promise.reject(error);
        }
      );

      console.log('Sending request...');
      const response = await api.post('/create-collect-request', requestBody);

      console.log('Payment creation successful!');
      return response.data;

    } catch (error: any) {
      console.error('Payment creation failed:');
      
      if (axios.isAxiosError(error)) {
        const errorDetails = {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        };
        
        console.error('Axios Error Details:', errorDetails);

        // Check for specific error types
        if (error.code === 'ERR_NETWORK') {
          console.error('Network Error - Possible CORS issue or API unavailable');
        } else if (error.code === 'ECONNABORTED') {
          console.error('Timeout Error - Request took too long');
        } else if (error.response?.status === 401) {
          console.error('Authentication Error - Check API key');
        } else if (error.response?.status === 400) {
          console.error('Bad Request - Check request format');
        } else if (error.response?.status === 403) {
          console.error('Forbidden - Check permissions');
        }
      } else {
        console.error('Unknown error:', error);
      }

      throw error;
    }
  }

  /**
   * Test CORS configuration
   */
  static async testCORS(): Promise<any> {
    try {
      console.log('Testing CORS...');
      
      const response = await fetch(`${PAYMENT_CONFIG.API_BASE_URL}/create-collect-request`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
      });
      
      console.log('CORS preflight response:', response.status);
      
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      
      console.log('CORS headers:', headers);
      
      return {
        status: response.status,
        headers: headers,
        allowed: response.status === 200 || response.status === 204
      };
    } catch (error) {
      console.error('CORS test error:', error);
      return {
        status: 0,
        headers: {},
        allowed: false,
        error: error
      };
    }
  }

  /**
   * Get debug information
   */
  static getDebugInfo() {
    return {
      config: {
        API_BASE_URL: PAYMENT_CONFIG.API_BASE_URL,
        API_KEY_SET: !!PAYMENT_CONFIG.API_KEY,
        API_KEY_LENGTH: PAYMENT_CONFIG.API_KEY?.length || 0,
        PG_KEY: PAYMENT_CONFIG.PG_KEY,
        SCHOOL_ID: PAYMENT_CONFIG.SCHOOL_ID
      },
      environment: {
        NODE_ENV: import.meta.env.NODE_ENV,
        MODE: import.meta.env.MODE,
        BASE_URL: import.meta.env.BASE_URL,
        DEV: import.meta.env.DEV,
        PROD: import.meta.env.PROD
      },
      location: {
        origin: window.location.origin,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        port: window.location.port
      },
      userAgent: navigator.userAgent,
      online: navigator.onLine
    };
  }

  /**
   * Test with sample JWT from documentation
   */
  static async testWithSampleJWT(): Promise<any> {
    try {
      console.log('Testing with sample JWT from documentation...');
      
      // Use the exact JWT from the documentation
      const sampleJWT = "eyJhbGciOiJIUzI1NiJ9.eyJzY2hvb2xfaWQiOiI2NWIwZTYyOTNlOWY3NmE5Njk0ZDg0YjQiLCJhbW91bnQiOiIxIiwiY2FsbGJhY2tfdXJsIjoiaHR0cHM6Ly9nb29nbGUuY29tIn0.DJ10HHluuiIc4ShhEPYEJZ2xWNpF_g1V0x2nGNcB9uk";
      
      const requestBody = {
        school_id: "65b0e6293e9f76a9694d84b4",
        amount: "1",
        callback_url: "https://google.com",
        sign: sampleJWT
      };

      console.log('Sample request body:', requestBody);

      const response = await fetch(`${PAYMENT_CONFIG.API_BASE_URL}/create-collect-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PAYMENT_CONFIG.API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Sample JWT test response:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sample JWT test error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Sample JWT test success:', data);
      return data;

    } catch (error) {
      console.error('Sample JWT test failed:', error);
      throw error;
    }
  }
}