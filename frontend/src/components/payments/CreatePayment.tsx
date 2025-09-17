import SimplePaymentTest from '../../components/SimplePaymentTest';
import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  School, 
  IndianRupee,
  Calendar,
  FileText,
  Send,
  Loader,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  X,
  Save
} from 'lucide-react';
// To this:
import { PaymentServiceCORSFix as PaymentService } from '../../services/PaymentService.corsfix';
// At the top of your CreatePayment.tsx file, add:



// Interfaces
interface PaymentFormData {
  schoolId: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  studentPhone: string;
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
  studentPhone?: string;
  feeType?: string;
  amount?: string;
  description?: string;
  dueDate?: string;
}

interface PaymentResponse {
  success: boolean;
  collect_request_id?: string;
  Collect_request_url?: string;
  message?: string;
  error?: string;
}

interface School {
  id: string;
  name: string;
}

interface PaymentRecord {
  collect_request_id?: string;
  student_info: {
    name: string;
    id: string;
    email: string;
    phone: string;
  };
  amount: number;
  fee_type: string;
  description: string;
  school_id: string;
  status: string;
  created_at: string;
  payment_url?: string;
}

const CreatePayment: React.FC = () => {
  const navigate = useNavigate();
  const config = PaymentService.getConfig();
  
  // Form state
  const [formData, setFormData] = useState<PaymentFormData>({
    schoolId: config.SCHOOL_ID,
    studentName: '',
    studentId: '',
    studentEmail: '',
    studentPhone: '',
    feeType: '',
    amount: 0,
    description: '',
    dueDate: ''
  });

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Load available schools from localStorage
  const [schools] = useState<School[]>(() => {
    const savedSchools = localStorage.getItem('schools');
    if (savedSchools) {
      try {
        const parsedSchools = JSON.parse(savedSchools) as any[];
        return parsedSchools.map(school => ({
          id: school.id,
          name: school.name
        }));
      } catch (error) {
        console.error('Error parsing schools from localStorage:', error);
      }
    }
    return [
      { id: '65b0e6293e9f76a9694d84b4', name: 'Delhi Public School' },
      { id: '65b0e6293e9f76a9694d84b5', name: 'Kendriya Vidyalaya' },
      { id: '65b0e6293e9f76a9694d84b6', name: 'Ryan International' },
      { id: '65b0e6293e9f76a9694d84b7', name: 'DAV Public School' }
    ];
  });

  const feeTypes: string[] = [
    'Tuition Fee',
    'Admission Fee',
    'Examination Fee',
    'Library Fee',
    'Laboratory Fee',
    'Sports Fee',
    'Transport Fee',
    'Hostel Fee',
    'Activity Fee',
    'Other'
  ];

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.schoolId) {
      newErrors.schoolId = 'Please select a school';
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
      newErrors.studentEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
      newErrors.studentEmail = 'Please enter a valid email address';
    }

    if (!formData.studentPhone.trim()) {
      newErrors.studentPhone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.studentPhone.replace(/\D/g, ''))) {
      newErrors.studentPhone = 'Please enter a valid 10-digit Indian phone number';
    }

    if (!formData.feeType) {
      newErrors.feeType = 'Please select a fee type';
    }

    if (!PaymentService.validateAmount(formData.amount)) {
      newErrors.amount = 'Amount must be between ₹1 and ₹1,00,000';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const numericValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Create payment request using real API
  const createPaymentRequest = async (): Promise<PaymentResponse> => {
    try {
      const callbackUrl = PaymentService.formatCallbackUrl(window.location.origin);
      
      console.log('Creating payment with:', {
        schoolId: formData.schoolId,
        amount: formData.amount,
        callbackUrl
      });

      const response = await PaymentService.createPayment(
        formData.schoolId,
        formData.amount,
        callbackUrl
      );

      return {
        success: true,
        collect_request_id: response.collect_request_id,
        Collect_request_url: response.Collect_request_url,
        message: 'Payment request created successfully'
      };

    } catch (error) {
      console.error('Payment creation error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to create payment request'
      };
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await createPaymentRequest();
      setPaymentResponse(response);

      if (response.success && response.Collect_request_url) {
        // Store payment details for tracking
        const paymentRecord: PaymentRecord = {
          collect_request_id: response.collect_request_id,
          student_info: {
            name: formData.studentName,
            id: formData.studentId,
            email: formData.studentEmail,
            phone: formData.studentPhone
          },
          amount: formData.amount,
          fee_type: formData.feeType,
          description: formData.description,
          school_id: formData.schoolId,
          status: 'pending',
          created_at: new Date().toISOString(),
          payment_url: response.Collect_request_url
        };

        // Save to localStorage for tracking
        const existingPayments = JSON.parse(localStorage.getItem('pending_payments') || '[]') as PaymentRecord[];
        existingPayments.push(paymentRecord);
        localStorage.setItem('pending_payments', JSON.stringify(existingPayments));
      }

    } catch (error) {
      console.error('Payment creation error:', error);
      setPaymentResponse({
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        message: 'Payment creation failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preview
  const handlePreview = (): void => {
    if (validateForm()) {
      setShowPreview(true);
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Handle form submission from preview
  const handlePreviewSubmit = (): void => {
    setShowPreview(false);
    const fakeEvent = new Event('submit') as any;
    handleSubmit(fakeEvent);
  };

  // Get school name
  const getSchoolName = (schoolId: string): string => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : 'Unknown School';
  };

  // Modal handlers
  const closeModal = (): void => {
    setShowPreview(false);
  };

  const closeResponseModal = (): void => {
    setPaymentResponse(null);
  };

  const handleOpenPaymentGateway = (): void => {
    if (paymentResponse?.Collect_request_url) {
      window.location.href = paymentResponse.Collect_request_url;
    }
  };

  const handleOpenInNewTab = (): void => {
    if (paymentResponse?.Collect_request_url) {
      window.open(paymentResponse.Collect_request_url, '_blank');
    }
  };

  const handleTrackPayment = (): void => {
    if (paymentResponse?.collect_request_id) {
      navigate(`/dashboard/transaction-status?collect_id=${paymentResponse.collect_request_id}`);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      // Then somewhere in your JSX (maybe at the top), add:
<SimplePaymentTest />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Payment</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Generate a new payment request for students
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/transactions')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transactions
        </button>
      </div>

      {/* Payment Form */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* School Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  School *
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.schoolId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select a school</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>
                {errors.schoolId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.schoolId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fee Type *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="feeType"
                    value={formData.feeType}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.feeType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select fee type</option>
                    {feeTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {errors.feeType && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.feeType}</p>}
              </div>
            </div>

            {/* Student Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Student Information</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.studentName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter student's full name"
                    />
                  </div>
                  {errors.studentName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student ID *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.studentId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter student ID or roll number"
                    />
                  </div>
                  {errors.studentId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="studentEmail"
                      value={formData.studentEmail}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.studentEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.studentEmail && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="studentPhone"
                      value={formData.studentPhone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.studentPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  {errors.studentPhone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentPhone}</p>}
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Details</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount || ''}
                      onChange={handleChange}
                      min="1"
                      max="100000"
                      step="1"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter amount"
                    />
                  </div>
                  {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      min={today}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.dueDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                  {errors.dueDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter payment description or purpose"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={handlePreview}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Preview Payment
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium text-white transition-all transform hover:scale-105 shadow-lg ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating Payment...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Create Payment Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Preview</h2>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Payment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">School:</span>
                      <span className="text-gray-900 dark:text-white">{getSchoolName(formData.schoolId)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Student:</span>
                      <span className="text-gray-900 dark:text-white">{formData.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fee Type:</span>
                      <span className="text-gray-900 dark:text-white">{formData.feeType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">₹{formData.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                      <span className="text-gray-900 dark:text-white">{new Date(formData.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-300">Next Steps</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                        After creating this payment request, the system will generate a secure payment link that can be shared with the student for completion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Edit Details
                </button>
                <button 
                  onClick={handlePreviewSubmit}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Confirm & Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Response Modal */}
      {paymentResponse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 text-center">
              {paymentResponse.success ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Payment Request Created!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Collect ID: <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{paymentResponse.collect_request_id}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Amount: <span className="font-semibold text-green-600">₹{formData.amount.toLocaleString()}</span>
                  </p>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={handleOpenPaymentGateway}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center font-medium"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Complete Payment Now
                    </button>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      This will take you to the secure payment gateway
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <button 
                        onClick={handleOpenInNewTab}
                        className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        Open Payment in New Tab
                      </button>
                      
                      <button 
                        onClick={handleTrackPayment}
                        className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        Track Payment Status
                      </button>
                      
                      <button 
                        onClick={closeResponseModal}
                        className="w-full text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        Stay on This Page
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Payment Creation Failed</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {paymentResponse.error || paymentResponse.message}
                  </p>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={closeResponseModal}
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Try Again
                    </button>
                    
                    <button 
                      onClick={() => navigate('/dashboard/transactions')}
                      className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      Go to Transactions
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePayment;