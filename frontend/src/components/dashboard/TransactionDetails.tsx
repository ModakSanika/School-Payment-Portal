import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  School,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

// Types
interface SchoolInfo {
  id: string;
  name: string;
  address: string;
  principal: string;
  email: string;
  phone: string;
  establishedYear: number;
  totalStudents: number;
  activeTransactions: number;
  totalRevenue: number;
  successRate: number;
}

interface SchoolTransaction {
  id: string;
  collectId: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  className: string;
  section: string;
  feeType: string;
  orderAmount: number;
  transactionAmount: number;
  status: 'success' | 'pending' | 'failed';
  paymentMode: string;
  gateway: string;
  bankReference: string;
  paymentTime: string | null;
  errorMessage?: string;
  customOrderId: string;
}

const TransactionDetails: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [feeTypeFilter, setFeeTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - In real app, fetch based on schoolId
  const schoolInfo: SchoolInfo = {
    id: schoolId || '',
    name: getSchoolName(schoolId),
    address: '123 Education Street, New Delhi, 110001',
    principal: 'Dr. Rajesh Kumar',
    email: 'principal@school.edu',
    phone: '+91 98765 43210',
    establishedYear: 1985,
    totalStudents: 2500,
    activeTransactions: 145,
    totalRevenue: 2450000,
    successRate: 97.8
  };

  const mockTransactions: SchoolTransaction[] = [
    {
      id: 'TXN001',
      collectId: 'COL_001_2025',
      studentName: 'Aarav Sharma',
      studentId: 'DPS001',
      studentEmail: 'aarav.sharma@dps.edu',
      className: 'Class 10',
      section: 'A',
      feeType: 'Tuition Fee',
      orderAmount: 5500,
      transactionAmount: 5520,
      status: 'success',
      paymentMode: 'upi',
      gateway: 'PhonePe',
      bankReference: 'YESBNK001',
      paymentTime: '2025-09-16T14:30:21Z',
      customOrderId: 'ORD_DPS_001_2025'
    },
    {
      id: 'TXN002',
      collectId: 'COL_002_2025',
      studentName: 'Priya Patel',
      studentId: 'DPS002',
      studentEmail: 'priya.patel@dps.edu',
      className: 'Class 8',
      section: 'B',
      feeType: 'Library Fee',
      orderAmount: 1200,
      transactionAmount: 1210,
      status: 'pending',
      paymentMode: 'netbanking',
      gateway: 'Razorpay',
      bankReference: 'ICICI002',
      paymentTime: null,
      customOrderId: 'ORD_DPS_002_2025'
    },
    {
      id: 'TXN003',
      collectId: 'COL_003_2025',
      studentName: 'Arjun Singh',
      studentId: 'DPS003',
      studentEmail: 'arjun.singh@dps.edu',
      className: 'Class 12',
      section: 'A',
      feeType: 'Exam Fee',
      orderAmount: 2500,
      transactionAmount: 2515,
      status: 'success',
      paymentMode: 'card',
      gateway: 'PhonePe',
      bankReference: 'HDFC003',
      paymentTime: '2025-09-16T12:45:33Z',
      customOrderId: 'ORD_DPS_003_2025'
    },
    // Add more mock data...
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `TXN${String(i + 4).padStart(3, '0')}`,
      collectId: `COL_${String(i + 4).padStart(3, '0')}_2025`,
      studentName: ['Ravi Kumar', 'Sneha Gupta', 'Rohit Sharma', 'Pooja Singh', 'Amit Verma'][i % 5],
      studentId: `DPS${String(i + 4).padStart(3, '0')}`,
      studentEmail: `student${i + 4}@dps.edu`,
      className: [`Class ${Math.floor(Math.random() * 12) + 1}`][0],
      section: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      feeType: ['Tuition Fee', 'Library Fee', 'Exam Fee', 'Transport Fee', 'Activity Fee'][Math.floor(Math.random() * 5)],
      orderAmount: Math.floor(Math.random() * 8000) + 1000,
      transactionAmount: Math.floor(Math.random() * 8000) + 1020,
      status: (['success', 'pending', 'failed'] as const)[Math.floor(Math.random() * 3)],
      paymentMode: ['upi', 'card', 'netbanking', 'wallet'][Math.floor(Math.random() * 4)],
      gateway: ['PhonePe', 'Razorpay', 'Paytm'][Math.floor(Math.random() * 3)],
      bankReference: `REF${String(i + 4).padStart(3, '0')}`,
      paymentTime: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      customOrderId: `ORD_DPS_${String(i + 4).padStart(3, '0')}_2025`
    }))
  ];

  // Helper function to get school name
  function getSchoolName(id: string | undefined): string {
    const schoolNames: Record<string, string> = {
      '65b0e6293e9f76a9694d84b4': 'Delhi Public School',
      '65b0e6293e9f76a9694d84b5': 'Kendriya Vidyalaya',
      '65b0e6293e9f76a9694d84b6': 'Ryan International',
      '65b0e6293e9f76a9694d84b7': 'DAV Public School',
      '65b0e6293e9f76a9694d84b8': 'St. Mary\'s School'
    };
    return schoolNames[id || ''] || 'Unknown School';
  }

  // Filter and paginate transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...mockTransactions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.id.toLowerCase().includes(query) ||
        transaction.studentName.toLowerCase().includes(query) ||
        transaction.studentId.toLowerCase().includes(query) ||
        transaction.studentEmail.toLowerCase().includes(query) ||
        transaction.feeType.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    // Apply fee type filter
    if (feeTypeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.feeType === feeTypeFilter);
    }

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      filtered = filtered.filter(transaction => {
        if (!transaction.paymentTime) return false;
        const transactionDate = new Date(transaction.paymentTime);
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    return filtered;
  }, [mockTransactions, searchQuery, statusFilter, feeTypeFilter, dateRange]);

  // Pagination
  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + pageSize);

  // Statistics
  const stats = useMemo(() => {
    const successful = filteredTransactions.filter(t => t.status === 'success');
    const pending = filteredTransactions.filter(t => t.status === 'pending');
    const failed = filteredTransactions.filter(t => t.status === 'failed');
    const totalRevenue = successful.reduce((sum, t) => sum + t.orderAmount, 0);
    
    return {
      total: filteredTransactions.length,
      successful: successful.length,
      pending: pending.length,
      failed: failed.length,
      totalRevenue,
      successRate: filteredTransactions.length > 0 ? (successful.length / filteredTransactions.length) * 100 : 0
    };
  }, [filteredTransactions]);

  // Utility functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/transactions')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Transactions
          </button>
          
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li>
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link to="/dashboard/transactions" className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Transactions
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-700 dark:text-gray-300 font-medium">
                    {schoolInfo.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* School Information Card */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <School className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {schoolInfo.name}
              </h1>
              <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{schoolInfo.address}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{schoolInfo.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{schoolInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{schoolInfo.totalStudents}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{schoolInfo.establishedYear}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Established</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.successRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Successful</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.successful}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, ID, or fee type..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={feeTypeFilter}
              onChange={(e) => setFeeTypeFilter(e.target.value)}
              className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm"
            >
              <option value="all">All Fee Types</option>
              <option value="Tuition Fee">Tuition Fee</option>
              <option value="Library Fee">Library Fee</option>
              <option value="Exam Fee">Exam Fee</option>
              <option value="Transport Fee">Transport Fee</option>
              <option value="Activity Fee">Activity Fee</option>
            </select>

            <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fee Information
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
              {paginatedTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id}
                  className="group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/10 dark:hover:to-purple-900/10 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium text-sm mr-4">
                        {transaction.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.studentName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {transaction.studentId}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.studentEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.feeType}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.className} - Section {transaction.section}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {transaction.customOrderId}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(transaction.orderAmount)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total: {formatCurrency(transaction.transactionAmount)}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Fee: {formatCurrency(transaction.transactionAmount - transaction.orderAmount)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1.5 capitalize">{transaction.status}</span>
                    </span>
                    {transaction.errorMessage && (
                      <div className="text-xs text-red-500 dark:text-red-400 mt-1 max-w-32 truncate" title={transaction.errorMessage}>
                        {transaction.errorMessage}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {transaction.gateway}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {transaction.paymentMode}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Ref: {transaction.bankReference}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDateTime(transaction.paymentTime)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {transaction.collectId}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                      <Eye className="w-3 h-3 mr-1" />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, totalTransactions)} of {totalTransactions} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;