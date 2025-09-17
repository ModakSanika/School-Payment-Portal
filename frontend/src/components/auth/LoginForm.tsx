import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import bgImage from '../assets/images/university-background.jpg';


interface LoginCredentials {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof LoginCredentials]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general login error
    if (loginError) {
      setLoginError('');
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      
      // Redirect to dashboard on successful login
      navigate('/dashboard', { replace: true });
      
    } catch (error: any) {
      setLoginError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background Based on Theme */}
      <div className="absolute inset-0">
        {/* Light Theme Background */}
        <div className={`w-full h-full transition-opacity duration-500 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
           backgroundImage: `url(${bgImage})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/70 to-purple-800/60"></div>
          </div>
        </div>
        
        {/* Dark Theme Background */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
            backgroundImage: `url(${bgImage})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-black/85 to-gray-800/80"></div>
          </div>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-300" />
          ) : (
            <Moon className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Login Container */}
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm w-full">
          {/* Dynamic Login Card Based on Theme */}
          <div className={`shadow-2xl rounded-lg p-8 border transition-all duration-300 ${
            isDark 
              ? 'bg-gray-800/90 backdrop-blur-md border-gray-600/50' 
              : 'bg-blue-700 border-blue-600'
          }`}>
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className={`text-2xl font-bold mb-1 ${
                isDark ? 'text-white' : 'text-white'
              }`}>
                Welcome
              </h1>
              <p className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-blue-100'
              }`}>
                To Student Portal
              </p>
            </div>

            {/* Sign In Label */}
            <div className="mb-6">
              <h2 className={`font-semibold text-lg ${
                isDark ? 'text-white' : 'text-white'
              }`}>
                Sign In
              </h2>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-blue-300'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={`w-full pl-10 pr-4 py-3 border rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className={`mt-1 text-xs ${
                    isDark ? 'text-red-400' : 'text-red-200'
                  }`}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-blue-300'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full pl-10 pr-12 py-3 border rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-700 focus:outline-none ${
                      isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className={`mt-1 text-xs ${
                    isDark ? 'text-red-400' : 'text-red-200'
                  }`}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="remember" className={`ml-2 text-sm ${
                  isDark ? 'text-gray-300' : 'text-white'
                }`}>
                  Remember me
                </label>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className={`border rounded p-3 animate-shake ${
                  isDark 
                    ? 'bg-red-900/50 border-red-600 text-red-300' 
                    : 'bg-red-600/90 border-red-500 text-white'
                }`}>
                  <p className="text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {loginError}
                  </p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-3 px-4 rounded transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:opacity-70 ${
                  isDark 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-800 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 space-y-2 text-center">
              <Link 
                to="/forgot-password" 
                className={`block text-sm transition-colors duration-200 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                • Have trouble login? Instructions
              </Link>
              
              <Link 
                to="/register" 
                className={`block text-sm transition-colors duration-200 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                New User? Create Your Account
              </Link>
              
              <Link 
                to="/help" 
                className={`block text-sm transition-colors duration-200 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Need Help? Forgot Username/Password?
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className={`mt-6 pt-4 border-t ${
              isDark ? 'border-gray-600' : 'border-blue-600'
            }`}>
              <div className="bg-gray-700/50 rounded p-3">
                <h4 className="text-blue-100 text-xs font-semibold mb-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Demo Login
                </h4>
                <p className="text-blue-200 text-xs mb-2">
                  <span className="font-mono">demo@school.com</span> / <span className="font-mono">demo123</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      email: 'demo@school.com',
                      password: 'demo123'
                    });
                    setErrors({});
                    setLoginError('');
                  }}
                  className="text-xs bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700/30 transition-colors"
                >
                  Fill Demo Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;