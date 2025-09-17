import { apiService } from './api';
import { API_ENDPOINTS, AUTH_CONFIG} from '../utils/constants';
import { storage } from '../utils/helpers';
import type { User, LoginCredentials, RegisterData} from '../types';

interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

interface RegisterResponse {
  user: User;
  message: string;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with email and password
   */
  public async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        API_ENDPOINTS.LOGIN,
        credentials
      );

      if (response.success && response.data) {
        const { user, token, expiresIn } = response.data;
        
        // Store authentication data
        this.setAuthData(user, token, expiresIn);
        
        return response.data;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Register new user
   */
  public async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = userData;

      const response = await apiService.post<RegisterResponse>(
        API_ENDPOINTS.REGISTER,
        registrationData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Registration failed');
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with local logout even if server call fails
      console.warn('Server logout failed, proceeding with local logout');
    } finally {
      // Clear local authentication data
      this.clearAuthData();
    }
  }

  /**
   * Get current user profile
   */
  public async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>(API_ENDPOINTS.PROFILE);

      if (response.success && response.data) {
        // Update stored user data
        storage.set(AUTH_CONFIG.USER_KEY, response.data);
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch user profile');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user profile');
    }
  }

  /**
   * Refresh authentication token
   */
  public async refreshToken(): Promise<string> {
    try {
      const response = await apiService.post<{ token: string; expiresIn: number }>(
        API_ENDPOINTS.REFRESH_TOKEN
      );

      if (response.success && response.data) {
        const { token, expiresIn } = response.data;
        
        // Update stored token
        this.setToken(token, expiresIn);
        
        return token;
      }

      throw new Error(response.message || 'Token refresh failed');
    } catch (error: any) {
      // If refresh fails, clear auth data and redirect to login
      this.clearAuthData();
      throw new Error(error.message || 'Token refresh failed');
    }
  }

  /**
   * Update user profile
   */
  public async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await apiService.patch<User>(API_ENDPOINTS.PROFILE, updates);

      if (response.success && response.data) {
        // Update stored user data
        storage.set(AUTH_CONFIG.USER_KEY, response.data);
        return response.data;
      }

      throw new Error(response.message || 'Profile update failed');
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    
    if (!token || !user) {
      return false;
    }

    // Check if token is expired
    return !this.isTokenExpired();
  }

  /**
   * Get stored authentication token
   */
  public getToken(): string | null {
    return storage.get<string>(AUTH_CONFIG.TOKEN_KEY);
  }

  /**
   * Get stored user data
   */
  public getUser(): User | null {
    return storage.get<User>(AUTH_CONFIG.USER_KEY);
  }

  /**
   * Check if token is expired
   */
  public isTokenExpired(): boolean {
    const expiryTime = storage.get<number>(AUTH_CONFIG.TOKEN_EXPIRY_KEY);
    
    if (!expiryTime) {
      return true;
    }

    const currentTime = Date.now();
    return currentTime >= expiryTime;
  }

  /**
   * Check if token needs refresh (within threshold)
   */
  public shouldRefreshToken(): boolean {
    const expiryTime = storage.get<number>(AUTH_CONFIG.TOKEN_EXPIRY_KEY);
    
    if (!expiryTime) {
      return false;
    }

    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;
    
    return timeUntilExpiry <= AUTH_CONFIG.REFRESH_THRESHOLD;
  }

  /**
   * Store authentication data
   */
  private setAuthData(user: User, token: string, expiresIn: number): void {
    const expiryTime = Date.now() + (expiresIn * 1000);
    
    storage.set(AUTH_CONFIG.USER_KEY, user);
    storage.set(AUTH_CONFIG.TOKEN_KEY, token);
    storage.set(AUTH_CONFIG.TOKEN_EXPIRY_KEY, expiryTime);
    
    // Update API service with new token
    apiService.updateToken(token);
  }

  /**
   * Store only token (for refresh scenarios)
   */
  private setToken(token: string, expiresIn: number): void {
    const expiryTime = Date.now() + (expiresIn * 1000);
    
    storage.set(AUTH_CONFIG.TOKEN_KEY, token);
    storage.set(AUTH_CONFIG.TOKEN_EXPIRY_KEY, expiryTime);
    
    // Update API service with new token
    apiService.updateToken(token);
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    storage.remove(AUTH_CONFIG.USER_KEY);
    storage.remove(AUTH_CONFIG.TOKEN_KEY);
    storage.remove(AUTH_CONFIG.TOKEN_EXPIRY_KEY);
    
    // Clear token from API service
    apiService.clearToken();
  }

  /**
   * Initialize auth state from storage
   */
  public initializeAuth(): { user: User | null; token: string | null; isAuthenticated: boolean } {
    const user = this.getUser();
    const token = this.getToken();
    const isAuthenticated = this.isAuthenticated();

    // If we have a token, set it in the API service
    if (token && isAuthenticated) {
      apiService.updateToken(token);
    } else if (!isAuthenticated) {
      // Clear invalid auth data
      this.clearAuthData();
    }

    return { user, token, isAuthenticated };
  }

  /**
   * Validate credentials format
   */
  public validateLoginCredentials(credentials: LoginCredentials): string[] {
    const errors: string[] = [];

    if (!credentials.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!credentials.password) {
      errors.push('Password is required');
    } else if (credentials.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  }

  /**
   * Validate registration data format
   */
  public validateRegistrationData(data: RegisterData): string[] {
    const errors: string[] = [];

    if (!data.name) {
      errors.push('Name is required');
    } else if (data.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!data.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.password) {
      errors.push('Password is required');
    } else if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!data.confirmPassword) {
      errors.push('Password confirmation is required');
    } else if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  }

  /**
   * Change password
   */
  public async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await apiService.post(
        '/auth/change-password',
        {
          currentPassword,
          newPassword
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Password change failed');
    }
  }

  /**
   * Request password reset
   */
  public async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });

      if (!response.success) {
        throw new Error(response.message || 'Password reset request failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Password reset request failed');
    }
  }

  /**
   * Reset password with token
   */
  public async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        password: newPassword
      });

      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export default
export default authService;