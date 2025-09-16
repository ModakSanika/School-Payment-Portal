import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Search,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  School,
  Filter,
  ChevronDown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State for functionality
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dateRange, setDateRange] = useState('30'); // Default to 30 days
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Date range options
  const dateRangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: '365', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  // Export options
  const exportOptions = [
    { format: 'csv', label: 'Export as CSV', description: 'Comma-separated values' },
    { format: 'excel', label: 'Export as Excel', description: 'Microsoft Excel format' },
    { format: 'pdf', label: 'Export as PDF', description: 'Printable PDF report' }
  ];

  // Mock data for the dashboard
  const [stats, setStats] = useState([
    {
      title: 'Total Revenue',
      value: '₹2,45,680',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      description: 'Revenue this month'
    },
    {
      title: 'Total Transactions',
      value: '1,234',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      description: 'Successful payments'
    },
    {
      title: 'Active Schools',
      value: '89',
      change: '+2.4%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      description: 'Schools registered'
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      change: '-0.3%',
      changeType: 'decrease' as const,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      description: 'Payment success rate'
    },
  ]);

  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 'TXN001',
      collectId: 'COL_001_2025',
      school: 'Delhi Public School',
      schoolId: '65b0e6293e9f76a9694d84b4',
      studentName: 'Aarav Sharma',
      studentEmail: 'aarav.sharma@dps.edu',
      amount: 5500,
      transactionAmount: 5520,
      status: 'success',
      paymentMode: 'upi',
      gateway: 'PhonePe',
      date: '2025-09-16T14:30:00Z',
      paymentTime: '2025-09-16T14:30:21Z'
    },
    {
      id: 'TXN002',
      collectId: 'COL_002_2025',
      school: 'Kendriya Vidyalaya',
      schoolId: '65b0e6293e9f76a9694d84b5',
      studentName: 'Priya Patel',
      studentEmail: 'priya.patel@kv.edu',
      amount: 3200,
      transactionAmount: 3210,
      status: 'pending',
      paymentMode: 'netbanking',
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
      studentEmail: 'arjun.singh@ryan.edu',
      amount: 8900,
      transactionAmount: 8925,
      status: 'success',
      paymentMode: 'card',
      gateway: 'PhonePe',
      date: '2025-09-16T12:45:00Z',
      paymentTime: '2025-09-16T12:45:33Z'
    },
    {
      id: 'TXN004',
      collectId: 'COL_004_2025',
      school: 'DAV Public School',
      schoolId: '65b0e6293e9f76a9694d84b7',
      studentName: 'Sneha Gupta',
      studentEmail: 'sneha.gupta@dav.edu',
      amount: 2100,
      transactionAmount: 2110,
      status: 'failed',
      paymentMode: 'upi',
      gateway: 'Paytm',
      date: '2025-09-16T11:20:00Z',
      paymentTime: '2025-09-16T11:20:15Z'
    },
    {
      id: 'TXN005',
      collectId: 'COL_005_2025',
      school: 'St. Mary\'s School',
      schoolId: '65b0e6293e9f76a9694d84b8',
      studentName: 'Rahul Kumar',
      studentEmail: 'rahul.kumar@stmarys.edu',
      amount: 4500,
      transactionAmount: 4515,
      status: 'success',
      paymentMode: 'wallet',
      gateway: 'PhonePe',
      date: '2025-09-16T10:30:00Z',
      paymentTime: '2025-09-16T10:30:45Z'
    }
  ]);

  const quickActions = [
    {
      title: 'Create Payment',
      description: 'Start a new payment request',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      href: '/dashboard/create-payment',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'View All Transactions',
      description: 'Browse all payment records',
      icon: Eye,
      color: 'from-green-500 to-green-600',
      href: '/dashboard/transactions',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Check Status',
      description: 'Look up transaction status',
      icon: Search,
      color: 'from-purple-500 to-purple-600',
      href: '/dashboard/transaction-status',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  // Handle refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last updated time
      setLastUpdated(new Date());
      
      // In a real app, you would fetch new data from your API here
      console.log('Data refreshed successfully');
      
      // Show success notification (you can implement toast notifications)
      alert('Dashboard data refreshed successfully!');
      
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle date range change
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setShowDateDropdown(false);
    
    // In a real app, you would filter data based on the selected range
    console.log(`Date range changed to: ${range} days`);
    
    // You can add API call here to fetch filtered data
    // Example: fetchDashboardData(range);
  };

  // Handle export functionality
  const handleExport = (format: string) => {
    setShowExportMenu(false);
    
    try {
      if (format === 'csv') {
        downloadCSV();
      } else if (format === 'excel') {
        downloadExcel();
      } else if (format === 'pdf') {
        downloadPDF();
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  // CSV Export
  const downloadCSV = () => {
    const headers = ['Transaction ID', 'School', 'Student', 'Amount', 'Status', 'Date'];
    const csvData = recentTransactions.map(t => [
      t.id,
      t.school,
      t.studentName,
      t.amount,
      t.status,
      new Date(t.date).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `transactions_${dateRange}days.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Excel Export (simplified - in real app you'd use a library like xlsx)
  const downloadExcel = () => {
    alert('Excel export functionality would be implemented with a library like SheetJS/xlsx');
  };

  // PDF Export (simplified - in real app you'd use a library like jsPDF)
  const downloadPDF = () => {
    alert('PDF export functionality would be implemented with a library like jsPDF');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDateDropdown(false);
      setShowExportMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSelectedDateLabel = () => {
    const option = dateRangeOptions.find(opt => opt.value === dateRange);
    return option ? option.label : 'Last 30 days';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your school payments today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDateDropdown(!showDateDropdown);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {getSelectedDateLabel()}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {/* Date Range Dropdown */}
            {showDateDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDateRangeChange(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      dateRange === option.value 
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Export Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowExportMenu(!showExportMenu);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {/* Export Dropdown */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                {exportOptions.map((option) => (
                  <button
                    key={option.format}
                    onClick={() => handleExport(option.format)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isRefreshing ? 'animate-pulse' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>
                
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <span className={`inline-flex items-center text-sm font-medium ${
                  stat.changeType === 'increase' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  vs last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              to={action.href}
              className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Latest payment activities across all schools
              </p>
            </div>
            <Link
              to="/dashboard/transactions"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
            >
              View all
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  School & Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {recentTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.id}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {transaction.collectId}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.school}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.studentName}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Fee: {formatCurrency(transaction.transactionAmount - transaction.amount)}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1 capitalize">{transaction.status}</span>
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDateTime(transaction.date)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.gateway} • {transaction.paymentMode}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => navigate(`/dashboard/transactions/school/${transaction.schoolId}`)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Showing 5 of 1,234 transactions</span>
            <Link 
              to="/dashboard/transactions"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
            >
              View all transactions →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Last updated: {lastUpdated.toLocaleString('en-IN')}
      </div>
    </div>
  );
};

export default Dashboard;