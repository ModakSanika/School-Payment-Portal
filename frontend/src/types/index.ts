// User Authentication Types
export interface User {
  _id: string;
  email: string;
  name: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateProfile?: (updates: Partial<User>) => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Transaction Related Types
export interface StudentInfo {
  name: string;
  id: string;
  email: string;
}

export interface Order {
  _id: string;
  school_id: string;
  trustee_id: string;
  student_info: StudentInfo;
  gateway_name: string;
  custom_order_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatus {
  _id: string;
  collect_id: string; // Reference to Order _id
  order_amount: number;
  transaction_amount: number;
  payment_mode: string;
  payment_details: string;
  bank_reference: string;
  payment_message: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  error_message?: string;
  payment_time?: string;
  createdAt: string;
  updatedAt: string;
}

// Combined Transaction Type (from aggregation)
export interface Transaction {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  custom_order_id: string;
  student_info: StudentInfo;
  payment_mode?: string;
  payment_details?: string;
  bank_reference?: string;
  payment_message?: string;
  payment_time?: string;
  error_message?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Creation Types
export interface PaymentRequest {
  amount: number;
  student_info: StudentInfo;
  gateway_name: string;
  school_id: string;
  trustee_id: string;
}

export interface PaymentResponse {
  success: boolean;
  data: {
    payment_url: string;
    collect_id: string;
    custom_order_id: string;
  };
  message: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

// Filter and Query Types
export interface TransactionFilters {
  status?: string | string[];
  school_id?: string | string[];
  gateway?: string | string[];
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: TransactionFilters;
}

// Theme Types
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// Component Props Types
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: string | ((record: T) => string);
  onRowClick?: (record: T) => void;
  className?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  validation?: {
    pattern?: RegExp;
    message?: string;
    min?: number;
    max?: number;
  };
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Status Badge Types
export type StatusType = 'success' | 'pending' | 'failed' | 'cancelled' | 'warning' | 'info';

export interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
  timestamp: string;
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  current?: boolean;
  badge?: string | number;
  children?: NavigationItem[];
}

// School Types
export interface School {
  _id: string;
  name: string;
  code: string;
  address?: string;
  contact?: string;
  email?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Webhook Log Types
export interface WebhookLog {
  _id: string;
  endpoint: string;
  method: string;
  payload: any;
  response: any;
  status_code: number;
  timestamp: string;
  error_message?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  totalAmount: number;
  todayTransactions: number;
  monthlyGrowth: number;
  successRate: number;
}