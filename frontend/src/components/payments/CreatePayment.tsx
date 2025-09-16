import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard,
  School,
  User,
  Mail,
  Hash,
  XCircle,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Copy,
  RefreshCw,
  Shield,
  Clock
} from 'lucide-react';

// Types
interface PaymentFormData {
  schoolId: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  feeType: string;
  amount: number;
  description: string;
  dueDate: string;
}

interface FormErrors {
  schoolId?: string;
  studentName?: string;
  studentId?: string;
  studentEmail?: string;
  feeType?: string;
  amount?: string;
  description?: string;
  dueDate?: string;
}

interface PaymentResponse {
  success: boolean;
  collectId: string;
  customOrderId: string;
  paymentUrl: string;
  message: string;
  error?: string;
}

const CreatePayment: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<PaymentFormData>({
    schoolId: '',
    studentName: '',
    studentId: '',
    studentEmail: '',
    feeType: '',
    amount: 0,
    description: '',
    dueDate: ''
  });

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // School options (in real app, this would come from API)
  const schoolOptions = [
    { id: '65b0e6293e9f76a9694d84b4', name: 'Delhi Public School' },
    { id: '65b0e6293e9f76a9694d84b5', name: 'Kendriya Vidyalaya' },
    { id: '65b0e6293e9f76a9694d84b6', name: 'Ryan International' },
    { id: '65b0e6293e9f76a9694d84b7', name: 'DAV Public School' },
    { id: '65b0e6293e9f76a9694d84b8', name: 'St. Mary\'s School' }
  ];

  // Fee type options
  const feeTypeOptions = [
    'Tuition Fee',
    'Library Fee',
    'Laboratory Fee',
    'Exam Fee',
    'Transport Fee',
    'Sports Fee',
    'Activity Fee',
    'Admission Fee',
    'Development Fee',
    'Computer Fee'
  ];

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.schoolId) {
      newErrors.schoolId = 'School selection is required';
    }

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    } else if (formData.studentName.trim().length < 2) {
      newErrors.studentName = 'Student name must be at least 2 characters';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }

    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = 'Student email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
      newErrors.studentEmail = 'Please enter a valid email address';
    }

    if (!formData.feeType) {
      newErrors.feeType = 'Fee type is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (formData.amount > 100000) {
      newErrors.amount = 'Amount cannot exceed ₹1,00,000';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));

    // Clear specific field error
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!showPreview) {
      setShowPreview(true);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call to create payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response
      const mockResponse: PaymentResponse = {
        success: true,
        collectId: `COL_${Date.now()}_2025`,
        customOrderId: `ORD_${formData.schoolId.slice(-3)}_${Date.now()}_2025`,
        paymentUrl: `https://payments.phonePe.com/pay/${Date.now()}`,
        message: 'Payment request created successfully'
      };

      setPaymentResponse(mockResponse);

    } catch (error: any) {
      setPaymentResponse({
        success: false,
        collectId: '',
        customOrderId: '',
        paymentUrl: '',
        message: 'Failed to create payment request',
        error: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      schoolId: '',
      studentName: '',
      studentId: '',
      studentEmail: '',
      feeType: '',
      amount: 0,
      description: '',
      dueDate: ''
    });
    setErrors({});
    setShowPreview(false);
    setPaymentResponse(null);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total amount (including gateway fee)
  const calculateTotalAmount = (amount: number) => {
    const gatewayFee = Math.max(amount * 0.02, 5); // 2% or minimum ₹5
    return amount + gatewayFee;
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Get selected school name
  const getSelectedSchoolName = () => {
    const school = schoolOptions.find(s => s.id === formData.schoolId);
    return school?.name || '';
  };

  // If payment created successfully, show success screen
  if (paymentResponse?.success) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Request Created
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your payment request has been successfully created and is ready for processing.
          </p>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Success!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {paymentResponse.message}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">Collect ID:</span>
              <div className="flex items-center">
                <span className="font-mono text-gray-900 dark:text-white mr-2">
                  {paymentResponse.collectId}
                </span>
                <button
                  onClick={() => copyToClipboard(paymentResponse.collectId)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
              <div className="flex items-center">
                <span className="font-mono text-gray-900 dark:text-white mr-2">
                  {paymentResponse.customOrderId}
                </span>
                <button
                  onClick={() => copyToClipboard(paymentResponse.customOrderId)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(formData.amount)}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">Student:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.studentName}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={paymentResponse.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-sm font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Proceed to Payment
            </a>
            
            <button
              onClick={resetForm}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Create Another Payment
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(`/dashboard/transaction-status?search=${paymentResponse.customOrderId}`)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
            >
              Track Payment Status →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Payment Request
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create a new payment request for school fees. Fill in the student details and fee information below.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center ${!showPreview ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${!showPreview ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-400 text-gray-400'}`}>
            1
          </div>
          <span className="ml-2 text-sm font-medium">Enter Details</span>
        </div>
        
        <div className="w-16 h-px bg-gray-300 dark:bg-gray-600"></div>
        
        <div className={`flex items-center ${showPreview ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${showPreview ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-400 text-gray-400'}`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium">Review & Create</span>
        </div>
      </div>

      {/* Main Content */}
      {!showPreview ? (
        // Step 1: Form
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* School Selection */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <School className="w-5 h-5 mr-2" />
                  School Information
                </h3>
                
                <div>
                  <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select School <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="schoolId"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Choose a school...</option>
                    {schoolOptions.map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  {errors.schoolId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.schoolId}
                    </p>
                  )}
                </div>
              </div>

              {/* Student Information */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Student Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="studentName"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      placeholder="Enter student's full name"
                      className="block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {errors.studentName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.studentName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Student ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      placeholder="Enter student ID"
                      className="block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {errors.studentId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.studentId}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Student Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="studentEmail"
                      name="studentEmail"
                      value={formData.studentEmail}
                      onChange={handleInputChange}
                      placeholder="Enter student's email address"
                      className="block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {errors.studentEmail && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.studentEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Fee Information */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Fee Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="feeType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fee Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="feeType"
                      name="feeType"
                      value={formData.feeType}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select fee type...</option>
                      {feeTypeOptions.map(feeType => (
                        <option key={feeType} value={feeType}>
                          {feeType}
                        </option>
                      ))}
                    </select>
                    {errors.feeType && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.feeType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount || ''}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="1"
                      max="100000"
                      className="block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.dueDate}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter fee description or additional details"
                      className="block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all transform hover:scale-105 shadow-lg"
                >
                  Review Payment Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar - Live Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Payment Preview
              </h3>
              
              {formData.amount > 0 ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(formData.amount)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      + Gateway Fee: {formatCurrency(calculateTotalAmount(formData.amount) - formData.amount)}
                    </p>
                    <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Total: {formatCurrency(calculateTotalAmount(formData.amount))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">School:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {getSelectedSchoolName() || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Student:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formData.studentName || 'Not entered'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fee Type:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formData.feeType || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('en-IN') : 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Enter amount to see preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Step 2: Preview and Confirmation
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Review Payment Details
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please review the information below before creating the payment request.
              </p>
            </div>

            {/* Payment Summary */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(formData.amount)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Gateway Fee: {formatCurrency(calculateTotalAmount(formData.amount) - formData.amount)}
                  </p>
                  <div className="border-t border-gray-200 dark:border-gray-600 mt-4 pt-4">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      Total Amount: {formatCurrency(calculateTotalAmount(formData.amount))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">School Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600 dark:text-gray-400">School:</span> {getSelectedSchoolName()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Student Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600 dark:text-gray-400">Name:</span> {formData.studentName}</p>
                    <p><span className="text-gray-600 dark:text-gray-400">ID:</span> {formData.studentId}</p>
                    <p><span className="text-gray-600 dark:text-gray-400">Email:</span> {formData.studentEmail}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Fee Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600 dark:text-gray-400">Type:</span> {formData.feeType}</p>
                    <p><span className="text-gray-600 dark:text-gray-400">Due Date:</span> {new Date(formData.dueDate).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Description</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 transform rotate-180" />
                Back to Edit
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-sm font-medium transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Payment Request
                  </>
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    Secure Payment Processing
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Your payment will be processed through our secure payment gateway. All transaction data is encrypted and protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Response */}
      {paymentResponse && !paymentResponse.success && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-6">
            <div className="flex items-start">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Payment Creation Failed
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  {paymentResponse.message}
                </p>
                {paymentResponse.error && (
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                    Error: {paymentResponse.error}
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </button>
                  <button
                    onClick={() => setPaymentResponse(null)}
                    className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePayment;