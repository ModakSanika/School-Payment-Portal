import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  School,
  CreditCard,
  DollarSign
} from 'lucide-react';

// Types
interface Transaction {
  id: string;
  collectId: string;
  schoolId: string;
  schoolName: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  orderAmount: number;
  transactionAmount: number;
  status: 'success' | 'pending' | 'failed';
  paymentMode: string;
  paymentDetails: string;
  gateway: string;
  bankReference: string;
  paymentMessage: string;
  paymentTime: string | null;
  errorMessage?: string;
  customOrderId: string;
}

interface FilterState {
  status: string[];
  schools: string[];
  gateways: string[];
  paymentModes: string[];
  dateRange: {
    from: string;
    to: string;
  };
}

type SortField = keyof Transaction;
type SortDirection = 'asc' | 'desc';

const TransactionOverview: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('limit') || '10'));
  const [sortField, setSortField] = useState<SortField>('paymentTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    schools: [],
    gateways: [],
    paymentModes: [],
    dateRange: {
      from: '',
      to: ''
    }
  });

  // Mock data - In real app, this would come from API
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN001',
      collectId: 'COL_001_2025',
      schoolId: '65b0e6293e9f76a9694d84b4',
      schoolName: 'Delhi Public School',
      studentName: 'Aarav Sharma',
      studentId: 'DPS001',
      studentEmail: 'aarav.sharma@dps.edu',
      orderAmount: 5500,
      transactionAmount: 5520,
      status: 'success',
      paymentMode: 'upi',
      paymentDetails: 'success@ybl',
      gateway: 'PhonePe',
      bankReference: 'YESBNK001',
      paymentMessage: 'payment success',
      paymentTime: '2025-09-16T14:30:21Z',
      customOrderId: 'ORD_DPS_001_2025'
    },
    {
      id: 'TXN002',
      collectId: 'COL_002_2025',
      schoolId: '65b0e6293e9f76a9694d84b5',
      schoolName: 'Kendriya Vidyalaya',
      studentName: 'Priya Patel',
      studentId: 'KV002',
      studentEmail: 'priya.patel@kv.edu',
      orderAmount: 3200,
      transactionAmount: 3210,
      status: 'pending',
      paymentMode: 'netbanking',
      paymentDetails: 'pending verification',
      gateway: 'Razorpay',
      bankReference: 'ICICI002',
      paymentMessage: 'payment processing',
      paymentTime: null,
      customOrderId: 'ORD_KV_002_2025'
    },
    {
      id: 'TXN003',
      collectId: 'COL_003_2025',
      schoolId: '65b0e6293e9f76a9694d84b6',
      schoolName: 'Ryan International',
      studentName: 'Arjun Singh',
      studentId: 'RIS003',
      studentEmail: 'arjun.singh@ryan.edu',
      orderAmount: 8900,
      transactionAmount: 8925,
      status: 'success',
      paymentMode: 'card',
      paymentDetails: '****1234',
      gateway: 'PhonePe',
      bankReference: 'HDFC003',
      paymentMessage: 'payment success',
      paymentTime: '2025-09-16T12:45:33Z',
      customOrderId: 'ORD_RIS_003_2025'
    },
    {
      id: 'TXN004',
      collectId: 'COL_004_2025',
      schoolId: '65b0e6293e9f76a9694d84b7',
      schoolName: 'DAV Public School',
      studentName: 'Sneha Gupta',
      studentId: 'DAV004',
      studentEmail: 'sneha.gupta@dav.edu',
      orderAmount: 2100,
      transactionAmount: 2110,
      status: 'failed',
      paymentMode: 'upi',
      paymentDetails: 'failed@ybl',
      gateway: 'Paytm',
      bankReference: 'SBI004',
      paymentMessage: 'insufficient balance',
      paymentTime: '2025-09-16T11:20:15Z',
      errorMessage: 'Insufficient balance in account',
      customOrderId: 'ORD_DAV_004_2025'
    },
    {
      id: 'TXN005',
      collectId: 'COL_005_2025',
      schoolId: '65b0e6293e9f76a9694d84b8',
      schoolName: 'St. Mary\'s School',
      studentName: 'Rahul Kumar',
      studentId: 'SMS005',
      studentEmail: 'rahul.kumar@stmarys.edu',
      orderAmount: 4500,
      transactionAmount: 4515,
      status: 'success',
      paymentMode: 'wallet',
      paymentDetails: 'paytm wallet',
      gateway: 'PhonePe',
      bankReference: 'AXIS005',
      paymentMessage: 'payment success',
      paymentTime: '2025-09-16T10:30:45Z',
      customOrderId: 'ORD_SMS_005_2025'
    },
    // Add more mock data...
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `TXN${String(i + 6).padStart(3, '0')}`,
      collectId: `COL_${String(i + 6).padStart(3, '0')}_2025`,
      schoolId: `65b0e6293e9f76a9694d84b${i % 5}`,
      schoolName: ['Delhi Public School', 'Kendriya Vidyalaya', 'Ryan International', 'DAV Public School', 'St. Mary\'s School'][i % 5],
      studentName: ['Aarav Sharma', 'Priya Patel', 'Arjun Singh', 'Sneha Gupta', 'Rahul Kumar'][i % 5],
      studentId: `STD${String(i + 6).padStart(3, '0')}`,
      studentEmail: `student${i + 6}@school.edu`,
      orderAmount: Math.floor(Math.random() * 10000) + 1000,
      transactionAmount: Math.floor(Math.random() * 10000) + 1020,
      status: (['success', 'pending', 'failed'] as const)[Math.floor(Math.random() * 3)],
      paymentMode: ['upi', 'card', 'netbanking', 'wallet'][Math.floor(Math.random() * 4)],
      paymentDetails: 'payment details',
      gateway: ['PhonePe', 'Razorpay', 'Paytm'][Math.floor(Math.random() * 3)],
      bankReference: `REF${String(i + 6).padStart(3, '0')}`,
      paymentMessage: 'payment processed',
      paymentTime: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      customOrderId: `ORD_${String(i + 6).padStart(3, '0')}_2025`
    }))
  ];

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...mockTransactions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.id.toLowerCase().includes(query) ||
        transaction.collectId.toLowerCase().includes(query) ||
        transaction.schoolName.toLowerCase().includes(query) ||
        transaction.studentName.toLowerCase().includes(query) ||
        transaction.studentEmail.toLowerCase().includes(query) ||
        transaction.customOrderId.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(transaction =>
        filters.status.includes(transaction.status)
      );
    }

    // Apply school filter
    if (filters.schools.length > 0) {
      filtered = filtered.filter(transaction =>
        filters.schools.includes(transaction.schoolId)
      );
    }

    // Apply gateway filter
    if (filters.gateways.length > 0) {
      filtered = filtered.filter(transaction =>
        filters.gateways.includes(transaction.gateway)
      );
    }

    // Apply payment mode filter
    if (filters.paymentModes.length > 0) {
      filtered = filtered.filter(transaction =>
        filters.paymentModes.includes(transaction.paymentMode)
      );
    }

    // Apply date range filter
    if (filters.dateRange.from && filters.dateRange.to) {
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      filtered = filtered.filter(transaction => {
        if (!transaction.paymentTime) return false;
        const transactionDate = new Date(transaction.paymentTime);
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle null values
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === null) return sortDirection === 'asc' ? -1 : 1;

      // Convert to comparable values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [mockTransactions, searchQuery, filters, sortField, sortDirection]);

  // Pagination
  const totalTransactions = filteredAndSortedTransactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = filteredAndSortedTransactions.slice(startIndex, endIndex);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (pageSize !== 10) params.set('limit', pageSize.toString());
    
    setSearchParams(params, { replace: true });
  }, [searchQuery, currentPage, pageSize, setSearchParams]);

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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      : <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === paginatedTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(paginatedTransactions.map(t => t.id));
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting transactions...', selectedTransactions);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Transactions
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and monitor all payment transactions across schools
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(filters.status.length > 0 || filters.schools.length > 0) && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {filters.status.length + filters.schools.length}
              </span>
            )}
          </button>
          
          <button
            onClick={handleExport}
            disabled={selectedTransactions.length === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export ({selectedTransactions.length})
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Bar */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by transaction ID, school name, student name, or email..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalTransactions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(filteredAndSortedTransactions.reduce((sum, t) => sum + t.orderAmount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {['success', 'pending', 'failed'].map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        setFilters(prev => ({
                          ...prev,
                          status: e.target.checked
                            ? [...prev.status, status]
                            : prev.status.filter(s => s !== status)
                        }));
                      }}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gateway Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gateway
              </label>
              <div className="space-y-2">
                {['PhonePe', 'Razorpay', 'Paytm'].map((gateway) => (
                  <label key={gateway} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.gateways.includes(gateway)}
                      onChange={(e) => {
                        setFilters(prev => ({
                          ...prev,
                          gateways: e.target.checked
                            ? [...prev.gateways, gateway]
                            : prev.gateways.filter(g => g !== gateway)
                        }));
                      }}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {gateway}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Mode Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Mode
              </label>
              <div className="space-y-2">
                {['upi', 'card', 'netbanking', 'wallet'].map((mode) => (
                  <label key={mode} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.paymentModes.includes(mode)}
                      onChange={(e) => {
                        setFilters(prev => ({
                          ...prev,
                          paymentModes: e.target.checked
                            ? [...prev.paymentModes, mode]
                            : prev.paymentModes.filter(m => m !== mode)
                        }));
                      }}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 uppercase">
                      {mode}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) => {
                    setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, from: e.target.value }
                    }));
                  }}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) => {
                    setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, to: e.target.value }
                    }));
                  }}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={() => setFilters({
                status: [],
                schools: [],
                gateways: [],
                paymentModes: [],
                dateRange: { from: '', to: '' }
              })}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Advanced Table with Hover Effects */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg overflow-hidden">
        
        {/* Table Header with Actions */}
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Select All ({selectedTransactions.length})
                </span>
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Table with Hover Effects */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <span className="sr-only">Select</span>
                </th>
                
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('id')}
                    className="group flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <span>Transaction ID</span>
                    {getSortIcon('id')}
                  </button>
                </th>
                
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('schoolName')}
                    className="group flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <span>School & Student</span>
                    {getSortIcon('schoolName')}
                  </button>
                </th>
                
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('orderAmount')}
                    className="group flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <span>Amount</span>
                    {getSortIcon('orderAmount')}
                  </button>
                </th>
                
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('status')}
                    className="group flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <span>Status</span>
                    {getSortIcon('status')}
                  </button>
                </th>
                
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('gateway')}
                    className="group flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <span>Gateway & Mode</span>
                    {getSortIcon('gateway')}
                  </button>
                </th>
                
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('paymentTime')}
                    className="group flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <span>Date & Time</span>
                    {getSortIcon('paymentTime')}
                  </button>
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
                  className={`group relative hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/10 dark:hover:to-purple-900/10 transition-all duration-300 cursor-pointer animate-fade-in ${
                    selectedTransactions.includes(transaction.id) ? 'bg-indigo-50/30 dark:bg-indigo-900/20' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover Effect Overlay */}
                  <td className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={() => handleSelectTransaction(transaction.id)}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {transaction.id}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {transaction.collectId}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.customOrderId}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <School className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {transaction.schoolName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.studentName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {transaction.studentId}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(transaction.orderAmount)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Total: {formatCurrency(transaction.transactionAmount)}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Fee: {formatCurrency(transaction.transactionAmount - transaction.orderAmount)}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium group-hover:scale-105 transition-transform duration-300 ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1.5 capitalize">{transaction.status}</span>
                    </span>
                    {transaction.errorMessage && (
                      <div className="text-xs text-red-500 dark:text-red-400 mt-1 max-w-32 truncate" title={transaction.errorMessage}>
                        {transaction.errorMessage}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {transaction.gateway}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {transaction.paymentMode}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Ref: {transaction.bankReference}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDateTime(transaction.paymentTime)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.paymentMessage}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right relative z-10">
                    <button 
                      onClick={() => navigate(`/dashboard/transactions/school/${transaction.schoolId}`)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
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
              Showing {startIndex + 1} to {Math.min(endIndex, totalTransactions)} of {totalTransactions} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                {totalPages > 5 && (
                  <>
                    <span className="text-gray-500 dark:text-gray-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionOverview;