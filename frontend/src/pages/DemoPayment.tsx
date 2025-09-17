// frontend/src/pages/DemoPayment.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const DemoPayment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  
  const collectId = searchParams.get('collect_id');
  const amount = searchParams.get('amount');
  const studentName = searchParams.get('student');

  useEffect(() => {
    // Simulate payment processing time
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSimulateSuccess = () => {
    // Simulate successful payment
    navigate(`/dashboard/transactions?payment_success=true&collect_id=${collectId}`);
  };

  const handleSimulateFailure = () => {
    // Simulate failed payment
    navigate(`/dashboard/transactions?payment_failed=true&collect_id=${collectId}`);
  };

  const handleGoBack = () => {
    navigate('/dashboard/create-payment');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment...</h2>
            <p className="text-gray-600">Please wait while we process your payment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo Payment Mode</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 mb-3">
              This is a demo payment page. Your application is working correctly, 
              but we're waiting for the real payment gateway credentials from Edviron.
            </p>
            
            <div className="text-left space-y-1 text-sm">
              <p><strong>Collect ID:</strong> {collectId}</p>
              <p><strong>Student:</strong> {studentName}</p>
              <p><strong>Amount:</strong> ₹{amount}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSimulateSuccess}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-5 h-5 inline mr-2" />
              Simulate Successful Payment
            </button>
            
            <button
              onClick={handleSimulateFailure}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Simulate Failed Payment
            </button>
            
            <button
              onClick={handleGoBack}
              className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back to Create Payment
            </button>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>For Developers:</strong> Once Edviron provides the PG secret key, 
              this demo page will be replaced with real Cashfree payment processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPayment;