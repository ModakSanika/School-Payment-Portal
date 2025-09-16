import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Copy,
  RefreshCw,
  Calendar,
  CreditCard,
  School,
  User,
  DollarSign,
  ExternalLink,
  History
} from 'lucide-react';

// Types
interface TransactionStatusResult {
  id: string;
  collectId: string;
  customOrderId: string;
  schoolName: string;
  schoolId: string;
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
  timeline: {
    timestamp: string;
    status: string;
    message: string;
  }[];
}

const TransactionStatus: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<TransactionStatusResult | null>(null);
  const [searchError, setSearchError] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'ORD_DPS_001_2025',
    'ORD_KV_002_2025',
    'TXN001',
    'COL_003_2025'
  ]);

  // Mock data for demonstration
  const mockTransactionData: Record<string, TransactionStatusResult> = {
    'ORD_DPS_001_2025': {
      id: 'TXN001',
      collectId: 'COL_001_2025',
      customOrderId: 'ORD_DPS_001_2025',
      schoolName: 'Delhi Public School',
      schoolId: '65b0e6293e9f76a9694d84b4',
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
      paymentMessage: 'Payment completed successfully',
      paymentTime: '2025-09-16T14:30:21Z',
      timeline: [
        {
          timestamp: '2025-09-16T14:25:10Z',
          status: 'initiated',
          message: 'Payment request created'
        },
        {
          timestamp: '2025-09-16T14:25:45Z',
          status: 'processing',
          message: 'Redirected to payment gateway'
        },
        {
          timestamp: '2025-09-16T14:30:21Z',
          status: 'success',
          message: 'Payment completed successfully'
        }
      ]
    },
    'ORD_KV_002_2025': {
      id: 'TXN002',
      collectId: 'COL_002_2025',
      customOrderId: 'ORD_KV_002_2025',
      schoolName: 'Kendriya Vidyalaya',
      schoolId: '65b0e6293e9f76a9694d84b5',
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
      paymentMessage: 'Payment is being processed',
      paymentTime: null,
      timeline: [
        {
          timestamp: '2025-09-16T13:10:00Z',
          status: 'initiated',
          message: 'Payment request created'
        },
        {
          timestamp: '2025-09-16T13:15:30Z',
          status: 'processing',
          message: 'Awaiting bank verification'
        }
      ]
    },
    'TXN001': {
      id: 'TXN001',
      collectId: 'COL_001_2025',
      customOrderId: 'ORD_DPS_001_2025',
      schoolName: 'Delhi Public School',
      schoolId: '65b0e6293e9f76a9694d84b4',
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
      paymentMessage: 'Payment completed successfully',
      paymentTime: '2025-09-16T14:30:21Z',
      timeline: [
        {
          timestamp: '2025-09-16T14:25:10Z',
          status: 'initiated',
          message: 'Payment request created'
        },
        {
          timestamp: '2025-09-16T14:25:45Z',
          status: 'processing',
          message: 'Redirected to payment gateway'
        },
        {
          timestamp: '2025-09-16T14:30:21Z',
          status: 'success',
          message: 'Payment completed successfully'
        }
      ]
    },
    'COL_003_2025': {
      id: 'TXN003',
      collectId: 'COL_003_2025',
      customOrderId: 'ORD_RIS_003_2025',
      schoolName: 'Ryan International',
      schoolId: '65b0e6293e9f76a9694d84b6',
      studentName: 'Arjun Singh',
      studentId: 'RIS003',
      studentEmail: 'arjun.singh@ryan.edu',
      orderAmount: 8900,
      transactionAmount: 8925,
      status: 'failed',
      paymentMode: 'card',
      paymentDetails: '****1234',
      gateway: 'PhonePe',
      bankReference: 'HDFC003',
      paymentMessage: 'Transaction failed due to insufficient funds',
      paymentTime: '2025-09-16T12:45:33Z',
      errorMessage: 'Insufficient balance in account',
      timeline: [
        {
          timestamp: '2025-09-16T12:40:10Z',
          status: 'initiated',
          message: 'Payment request created'
        },
        {
          timestamp: '2025-09-16T12:42:20Z',
          status: 'processing',
          message: 'Processing card payment'
        },
        {
          timestamp: '2025-09-16T12:45:33Z',
          status: 'failed',
          message: 'Transaction failed due to insufficient funds'
        }
      ]
    }
  };

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) {
      setSearchError('Please enter a transaction ID or order ID');
      return;
    }

    setIsLoading(true);
    setSearchError('');
    setSearchResult(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Look for the transaction in mock data
      const result = mockTransactionData[searchTerm.trim()];
      
      if (result) {
        setSearchResult(result);
        
        // Add to recent searches if not already present
        setRecentSearches(prev => {
          const filtered = prev.filter(item => item !== searchTerm);
          return [searchTerm, ...filtered].slice(0, 5);
        });
      } else {
        setSearchError('Transaction not found. Please check the ID and try again.');
      }
    } catch (error) {
      setSearchError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
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
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Transaction Status Check
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Enter your transaction ID, order ID, or collect ID to check the current status and get detailed information about your payment.
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-8">
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transaction / Order / Collect ID
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g., ORD_DPS_001_2025, TXN001, COL_001_2025"
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  Searching...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Check Transaction Status
                </div>
              )}
            </button>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Recent Searches:
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <History className="w-3 h-3 mr-1" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {searchError && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                  {searchError}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResult && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Overview Card */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="mx-auto mb-4">
                  {getStatusIcon(searchResult.status)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Transaction {searchResult.status === 'success' ? 'Successful' : searchResult.status === 'pending' ? 'Pending' : 'Failed'}
                </h2>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(searchResult.status)}`}>
                  {searchResult.status.charAt(0).toUpperCase() + searchResult.status.slice(1)}
                </span>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  {searchResult.paymentMessage}
                </p>
                {searchResult.errorMessage && (
                  <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
                    Error: {searchResult.errorMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Transaction Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Transaction Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                  <div className="flex items-center">
                    <span className="font-mono text-gray-900 dark:text-white">{searchResult.id}</span>
                    <button
                      onClick={() => copyToClipboard(searchResult.id)}
                      className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                  <div className="flex items-center">
                    <span className="font-mono text-gray-900 dark:text-white">{searchResult.customOrderId}</span>
                    <button
                      onClick={() => copyToClipboard(searchResult.customOrderId)}
                      className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Collect ID:</span>
                  <div className="flex items-center">
                    <span className="font-mono text-gray-900 dark:text-white">{searchResult.collectId}</span>
                    <button
                      onClick={() => copyToClipboard(searchResult.collectId)}
                      className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(searchResult.orderAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(searchResult.transactionAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Gateway Fee:</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    {formatCurrency(searchResult.transactionAmount - searchResult.orderAmount)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Payment Time:</span>
                  <span className="font-mono text-gray-900 dark:text-white text-sm">
                    {formatDateTime(searchResult.paymentTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Student & School Information */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <School className="w-5 h-5 mr-2" />
                Student & School Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">School:</span>
                  <Link 
                    to={`/dashboard/transactions/school/${searchResult.schoolId}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center"
                  >
                    {searchResult.schoolName}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Student Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{searchResult.studentName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Student ID:</span>
                  <span className="font-mono text-gray-900 dark:text-white">{searchResult.studentId}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-mono text-gray-900 dark:text-white text-sm">{searchResult.studentEmail}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Payment Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Gateway:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{searchResult.gateway}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Payment Mode:</span>
                  <span className="font-medium text-gray-900 dark:text-white uppercase">{searchResult.paymentMode}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Payment Details:</span>
                  <span className="font-mono text-gray-900 dark:text-white">{searchResult.paymentDetails}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Bank Reference:</span>
                  <div className="flex items-center">
                    <span className="font-mono text-gray-900 dark:text-white">{searchResult.bankReference}</span>
                    <button
                      onClick={() => copyToClipboard(searchResult.bankReference)}
                      className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Timeline */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Transaction Timeline
              </h3>
              
              <div className="space-y-4">
                {searchResult.timeline.map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      event.status === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                      event.status === 'failed' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                      event.status === 'processing' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {event.status === 'success' ? <CheckCircle className="w-4 h-4" /> :
                       event.status === 'failed' ? <XCircle className="w-4 h-4" /> :
                       event.status === 'processing' ? <Clock className="w-4 h-4" /> :
                       <AlertCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleSearch()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </button>
            
            <Link
              to={`/dashboard/transactions/school/${searchResult.schoolId}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              <School className="w-4 h-4 mr-2" />
              View School Transactions
            </Link>
          </div>
        </div>
      )}

      {/* Help Section */}
      {!searchResult && !isLoading && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Need Help Finding Your Transaction?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Transaction ID</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Usually starts with "TXN" followed by numbers (e.g., TXN001)
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order ID</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Format: ORD_SCHOOL_XXX_YEAR (e.g., ORD_DPS_001_2025)
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <History className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Collect ID</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Format: COL_XXX_YEAR (e.g., COL_001_2025)
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Still can't find your transaction? 
                <Link to="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-1 font-medium">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;