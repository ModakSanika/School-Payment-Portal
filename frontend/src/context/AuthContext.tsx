import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Types
interface User {
  _id: string;
  email: string;
  name: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Mock auth service functions (replace with real API calls later)
const mockAuthService = {
  login: async (credentials: { email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    if (credentials.email === 'demo@school.com' && credentials.password === 'demo123') {
      return {
        user: {
          _id: '1',
          email: credentials.email,
          name: 'Demo User',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'mock_jwt_token_12345',
        expiresIn: 3600
      };
    } else {
      throw new Error('Invalid email or password');
    }
  },
  
  register: async (data: { name: string; email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: {
        _id: '2',
        email: data.email,
        name: data.name,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  },

  logout: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  initializeAuth: () => {
    const token = localStorage.getItem('school_payment_token');
    const userStr = localStorage.getItem('school_payment_user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    return {
      user,
      token,
      isAuthenticated: !!(token && user)
    };
  }
};

const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize authentication state from storage
  const initializeAuth = useCallback(() => {
    try {
      setIsLoading(true);
      
      const authData = mockAuthService.initializeAuth();
      
      setUser(authData.user);
      setToken(authData.token);
      setIsAuthenticated(authData.isAuthenticated);
      
      console.log('Auth initialized:', {
        hasUser: !!authData.user,
        hasToken: !!authData.token,
        isAuthenticated: authData.isAuthenticated
      });
      
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      const loginResponse = await mockAuthService.login({ email, password });
      
      setUser(loginResponse.user);
      setToken(loginResponse.token);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('school_payment_token', loginResponse.token);
      localStorage.setItem('school_payment_user', JSON.stringify(loginResponse.user));
      
      console.log('Login successful:', loginResponse.user.email);
      
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      throw new Error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      const registerResponse = await mockAuthService.register({ name, email, password });
      
      console.log('Registration successful:', registerResponse.user.email);
      
      // Note: After registration, user typically needs to login
      // We don't automatically authenticate after registration
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      await mockAuthService.logout();
      
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      // Clear localStorage
      localStorage.removeItem('school_payment_token');
      localStorage.removeItem('school_payment_user');
      
      console.log('Logout successful');
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if server logout fails, clear local state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('school_payment_token');
      localStorage.removeItem('school_payment_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Provide authentication context
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};