// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'school_payment_token',
  USER_KEY: 'school_payment_user',
  TOKEN_EXPIRY_KEY: 'school_payment_token_expiry',
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'school_payment_theme',
  TABLE_PREFERENCES: 'school_payment_table_prefs',
  FILTERS: 'school_payment_filters',
  SIDEBAR_COLLAPSED: 'school_payment_sidebar_collapsed',
} as const;

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export const STATUS_COLORS = {
  [TRANSACTION_STATUS.PENDING]: {
    bg: 'bg-warning-50',
    text: 'text-warning-700',
    border: 'border-warning-200',
    badge: 'bg-warning-100 text-warning-800',
  },
  [TRANSACTION_STATUS.SUCCESS]: {
    bg: 'bg-success-50',
    text: 'text-success-700',
    border: 'border-success-200',
    badge: 'bg-success-100 text-success-800',
  },
  [TRANSACTION_STATUS.FAILED]: {
    bg: 'bg-danger-50',
    text: 'text-danger-700',
    border: 'border-danger-200',
    badge: 'bg-danger-100 text-danger-800',
  },
  [TRANSACTION_STATUS.CANCELLED]: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-800',
  },
} as const;

// Payment Gateways
export const PAYMENT_GATEWAYS = [
  { value: 'PhonePe', label: 'PhonePe' },
  { value: 'Paytm', label: 'Paytm' },
  { value: 'GooglePay', label: 'Google Pay' },
  { value: 'Razorpay', label: 'Razorpay' },
  { value: 'PayU', label: 'PayU' },
  { value: 'CCAvenue', label: 'CCAvenue' },
] as const;

// Payment Modes
export const PAYMENT_MODES = [
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net Banking' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'emi', label: 'EMI' },
] as const;

// Pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Table Configuration
export const TABLE_CONFIG = {
  ROW_HEIGHT: 56,
  HEADER_HEIGHT: 48,
  MAX_ROWS_BEFORE_VIRTUAL: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm:ss',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const;

// Currency
export const CURRENCY_CONFIG = {
  SYMBOL: '₹',
  CODE: 'INR',
  LOCALE: 'en-IN',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  AADHAR: /^\d{12}$/,
  STUDENT_ID: /^[A-Z0-9]{6,12}$/,
  AMOUNT: /^\d+(\.\d{1,2})?$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logged out successfully!',
  REGISTRATION: 'Account created successfully!',
  PAYMENT_CREATED: 'Payment request created successfully!',
  DATA_UPDATED: 'Data updated successfully!',
  DATA_DELETED: 'Data deleted successfully!',
} as const;

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  SCHOOL_TRANSACTIONS: '/transactions/school',
  TRANSACTION_STATUS: '/transaction-status',
  CREATE_PAYMENT: '/create-payment',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  REPORTS: '/reports',
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// File Upload
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// School Configuration
export const SCHOOL_CONFIG = {
  DEFAULT_SCHOOL_ID: '65b0e6293e9f76a9694d84b4',
  DEFAULT_TRUSTEE_ID: '65b0e552dd31950a9b41c5ba',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  PROFILE: '/auth/profile',
  
  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_BY_SCHOOL: '/transactions/school',
  TRANSACTION_STATUS: '/transaction-status',
  CREATE_PAYMENT: '/create-payment',
  
  // Webhook
  WEBHOOK: '/webhook',
  WEBHOOK_LOGS: '/webhook-logs',
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  
  // Schools
  SCHOOLS: '/schools',
} as const;