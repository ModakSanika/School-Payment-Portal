import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ExternalLink,
  Copy,
  FileText,
  CreditCard,
  Building,
  User,
  IndianRupee
} from 'lucide-react';

// Types
interface Transaction {
  id: string;
  collectId: string;
  school: string;
  schoolId: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  amount: number;
  transactionAmount: number;
  status: 'success' | 'pending' | 'failed';
  paymentMode: string;
  gateway: string;
  date: string;
  paymentTime: string | null;
  bankReference?: string;
  paymentDetails?: string;
  errorMessage?: string;
}

interface FilterState {
  status: string[];
  schools: string[];
  gateways: string[];
  paymentModes: string[];
  dateRange: string;
  customDateStart: string;
  customDateEnd: string;
}

interface SortState {
  field: keyof Transaction;
  direction: 'asc' | 'desc';
}

const TransactionOverview: React.FC = () => {
  const navigate = useNavigate();

  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Filter and Sort State
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    schools: [],
    gateways: [],
    paymentModes: [],
    dateRange: '30',
    customDateStart: '',
    customDateEnd: ''
  });

  const [sort, setSort] = useState<SortState>({
    field: 'date',
    direction: 'desc'
  });

  // Mock Data - Enhanced with more transactions
  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      collectId: 'COL_001_2025',
      school: 'Delhi Public School',
      schoolId: '65b0e6293e9f76a9694d84b4',
      studentName: 'Aarav Sharma',
      studentId: 'DPS001',
      studentEmail: 'aarav.sharma@dps.edu',
      amount: 5500,
      transactionAmount: 5520,
      status: 'success',
      paymentMode: 'UPI',
      gateway: 'PhonePe',
      date: '2025-09-16T14:30:00Z',
      paymentTime: '2025-09-16T14:30:21Z',
      bankReference: 'YESBNK123',
      paymentDetails: 'success@ybl'
    },
    {
      id: 'TXN002',
      collectId: 'COL_002_2025',
      school: 'Kendriya Vidyalaya',
      schoolId: '65b0e6293e9f76a9694d84b5',
      studentName: 'Priya Patel',
      studentId: 'KV002',
      studentEmail: 'priya.patel@kv.edu',
      amount: 3200,
      transactionAmount: 3210,
      status: 'pending',
      paymentMode: 'Net Banking',
      gateway: 'Razorpay',
      date: '2025-09-16T13:15:00Z',
      paymentTime: null
    },
    {
      id: 'TXN003',
      collectId: 'COL_003_2025',
      school: 'Ryan International',
      schoolId: '65b0e6293e9f76a9694d84b6',
      studentName: 'Arjun Singh',
      studentId: 'RYN003',
      studentEmail: 'arjun.singh@ryan.edu',
      amount: 8900,
      transactionAmount: 8925,
      status: 'success',
      paymentMode: 'Credit Card',
      gateway: 'PhonePe',
      date: '2025-09-16T12:45:00Z',
      paymentTime: '2025-09-16T12:45:33Z',
      bankReference: 'HDFC456',
      paymentDetails: '**** 1234'
    },
    {
      id: 'TXN004',
      collectId: 'COL_004_2025',
      school: 'DAV Public School',
      schoolId: '65b0e6293e9f76a9694d84b7',
      studentName: 'Sneha Gupta',
      studentId: 'DAV004',
      studentEmail: 'sneha.gupta@dav.edu',
      amount: 2100,
      transactionAmount: 2110,
      status: 'failed',
      paymentMode: 'UPI',
      gateway: 'Paytm',
      date: '2025-09-16T11:20:00Z',
      paymentTime: '2025-09-16T11:20:15Z',
      errorMessage: 'Insufficient Balance'
    },
    {
      id: 'TXN005',
      collectId: 'COL_005_2025',
      school: 'St. Mary\'s School',
      schoolId: '65b0e6293e9f76a9694d84b8',
      studentName: 'Rahul Kumar',
      studentId: 'STM005',
      studentEmail: 'rahul.kumar@stmarys.edu',
      amount: 4500,
      transactionAmount: 4515,
      status: 'success',
      paymentMode: 'Wallet',
      gateway: 'PhonePe',
      date: '2025-09-16T10:30:00Z',
      paymentTime: '2025-09-16T10:30:45Z',
      bankReference: 'PPE789',
      paymentDetails: 'PayTM Wallet'
    }
    // Add more mock data...
  ]);

  // Unique values for filters
  const uniqueSchools = [...new Set(transactions.map(t => t.school))];
  const uniqueGateways = [...new Set(transactions.map(t => t.gateway))];
  const uniquePaymentModes = [...new Set(transactions.map(t => t.paymentMode))];

  // Filtered and Sorted Data
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.id.toLowerCase().includes(searchLower) ||
        transaction.collectId.toLowerCase().includes(searchLower) ||
        transaction.school.toLowerCase().includes(searchLower) ||
        transaction.studentName.toLowerCase().includes(searchLower) ||
        transaction.studentEmail.toLowerCase().includes(searchLower) ||
        transaction.gateway.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(t => filters.status.includes(t.status));
    }

    // School filter
    if (filters.schools.length > 0) {
      filtered = filtered.filter(t => filters.schools.includes(t.school));
    }

    // Gateway filter
    if (filters.gateways.length > 0) {
      filtered = filtered.filter(t => filters.gateways.includes(t.gateway));
    }

    // Payment Mode filter
    if (filters.paymentModes.length > 0) {
      filtered = filtered.filter(t => filters.paymentModes.includes(t.paymentMode));
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const daysBack = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(t => new Date(t.date) >= cutoffDate);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sort.field];
      let bValue: any = b[sort.field];

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle dates
      if (sort.field === 'date' || sort.field === 'paymentTime') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
        return sort.direction === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }

      // Handle strings
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, searchTerm, filters, sort]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleSort = (field: keyof Transaction) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleRowSelect = (id: string) => {
    setSelectedTransactions(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === paginatedTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(paginatedTransactions.map(t => t.id));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  // Status helpers
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
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
      {/* Header */}
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
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>

          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions, schools, students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(filters.status.length > 0 || filters.schools.length > 0) && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-indigo-500 text-white text-xs rounded-full">
                {filters.status.length + filters.schools.length}
              </span>
            )}
          </button>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredTransactions.length} of {transactions.length} transactions
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {['success', 'pending', 'failed'].map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => {
                          const newStatus = e.target.checked
                            ? [...filters.status, status]
                            : filters.status.filter(s => s !== status);
                          handleFilterChange('status', newStatus);
                        }}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* School Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schools
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uniqueSchools.map(school => (
                    <label key={school} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.schools.includes(school)}
                        onChange={(e) => {
                          const newSchools = e.target.checked
                            ? [...filters.schools, school]
                            : filters.schools.filter(s => s !== school);
                          handleFilterChange('schools', newSchools);
                        }}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">
                        {school}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gateway Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Gateway
                </label>
                <div className="space-y-2">
                  {uniqueGateways.map(gateway => (
                    <label key={gateway} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.gateways.includes(gateway)}
                        onChange={(e) => {
                          const newGateways = e.target.checked
                            ? [...filters.gateways, gateway]
                            : filters.gateways.filter(g => g !== gateway);
                          handleFilterChange('gateways', newGateways);
                        }}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {gateway}
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
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All time</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(filters.status.length > 0 || filters.schools.length > 0 || filters.gateways.length > 0) && (
              <div className="mt-4">
                <button
                  onClick={() => setFilters({
                    status: [],
                    schools: [],
                    gateways: [],
                    paymentModes: [],
                    dateRange: '30',
                    customDateStart: '',
                    customDateEnd: ''
                  })}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg overflow-hidden">
        {/* Table Header Actions */}
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {selectedTransactions.length > 0 
                    ? `${selectedTransactions.length} selected` 
                    : 'Select all'
                  }
                </span>
              </label>

              {selectedTransactions.length > 0 && (
                <div className="flex items-center gap-2">
                  <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">
                    Export Selected
                  </button>
                  <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-medium">
                    Delete Selected
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </th>

                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Transaction ID</span>
                    {sort.field === 'id' ? (
                      sort.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>

                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('school')}
                >
                  <div className="flex items-center space-x-1">
                    <span>School & Student</span>
                    {sort.field === 'school' ? (
                      sort.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>

                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    {sort.field === 'amount' ? (
                      sort.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>

                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sort.field === 'status' ? (
                      sort.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>

                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('gateway')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Gateway & Mode</span>
                    {sort.field === 'gateway' ? (
                      sort.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>

                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date & Time</span>
                    {sort.field === 'date' ? (
                      sort.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {paginatedTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/10 dark:hover:to-purple-900/10 hover:shadow-md hover:scale-[1.01] hover:z-10 relative group ${
                    selectedTransactions.includes(transaction.id) 
                      ? 'bg-indigo-50/50 dark:bg-indigo-900/20' 
                      : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(transaction.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    transformOrigin: 'center'
                  }}
                >
                  {/* Hover Glow Effect */}
                  {hoveredRow === transaction.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg pointer-events-none transform scale-105 blur-sm" />
                  )}

                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={() => handleRowSelect(transaction.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.id}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {transaction.collectId}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.school}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-1">
                          <User className="w-3 h-3" />
                          <span>{transaction.studentName}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Total: {formatCurrency(transaction.transactionAmount)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1 capitalize">{transaction.status}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {transaction.gateway}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.paymentMode}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap relative z-10">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDateTime(transaction.date)}
                      </div>
                      {transaction.paymentTime && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Completed: {formatDateTime(transaction.paymentTime)}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative z-10">
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === transaction.id ? null : transaction.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Action Menu */}
                      {showActionMenu === transaction.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                          <button
                            onClick={() => navigate(`/dashboard/transactions/${transaction.id}`)}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4 mr-3" />
                            View Details
                          </button>
                          <button
                            onClick={() => copyToClipboard(transaction.id)}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Copy className="w-4 h-4 mr-3" />
                            Copy ID
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/transactions/school/${transaction.schoolId}`)}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Building className="w-4 h-4 mr-3" />
                            View School
                          </button>
                          <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FileText className="w-4 h-4 mr-3" />
                            Generate Receipt
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionOverview;