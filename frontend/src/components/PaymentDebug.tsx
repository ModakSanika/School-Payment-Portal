// src/components/PaymentDebug.tsx
import React, { useState } from 'react';
import { DebugPaymentService } from '../services/PaymentService.debug';

const PaymentDebug: React.FC = () => {
  const [debugOutput, setDebugOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    setDebugOutput(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearLogs = () => {
    setDebugOutput([]);
  };

  const testConnection = async () => {
    addLog('Testing API connection...');
    setIsLoading(true);
    
    try {
      const result = await DebugPaymentService.testConnection();
      addLog(`Connection test: ${result ? 'SUCCESS' : 'FAILED'}`);
    } catch (error: any) {
      addLog(`Connection test ERROR: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCORS = async () => {
    addLog('Testing CORS configuration...');
    setIsLoading(true);
    
    try {
      const result = await DebugPaymentService.testCORS();
      addLog(`CORS test result: ${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      addLog(`CORS test ERROR: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPaymentCreation = async () => {
    addLog('Testing payment creation...');
    setIsLoading(true);
    
    try {
      const result = await DebugPaymentService.createPayment(
        '65b0e6293e9f76a9694d84b4',
        100,
        'http://localhost:5173/callback'
      );
      addLog(`Payment creation SUCCESS: ${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      addLog(`Payment creation ERROR: ${error.message}`);
      if (error.response?.data) {
        addLog(`Error details: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testSampleJWT = async () => {
    addLog('Testing with sample JWT from documentation...');
    setIsLoading(true);
    
    try {
      const result = await DebugPaymentService.testWithSampleJWT();
      addLog(`Sample JWT test SUCCESS: ${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      addLog(`Sample JWT test ERROR: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showDebugInfo = () => {
    const info = DebugPaymentService.getDebugInfo();
    addLog('=== DEBUG INFO ===');
    addLog(JSON.stringify(info, null, 2));
    addLog('=== END DEBUG INFO ===');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Payment API Debug Console
      </h2>
      
      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <button
          onClick={showDebugInfo}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
        >
          Show Config
        </button>
        
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm"
        >
          Test Connection
        </button>
        
        <button
          onClick={testCORS}
          disabled={isLoading}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-400 transition-colors text-sm"
        >
          Test CORS
        </button>
        
        <button
          onClick={testSampleJWT}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 transition-colors text-sm"
        >
          Test Sample JWT
        </button>
        
        <button
          onClick={testPaymentCreation}
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 transition-colors text-sm"
        >
          Test Payment
        </button>
        
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
        >
          Clear Logs
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
          <p className="text-yellow-800 dark:text-yellow-200">Running test...</p>
        </div>
      )}

      {/* Debug Output */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Debug Output:</h3>
        {debugOutput.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No debug output yet. Click a test button to start.</p>
        ) : (
          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {debugOutput.join('\n')}
          </pre>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">Debug Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
          <li><strong>Show Config:</strong> Verify environment variables and configuration</li>
          <li><strong>Test Connection:</strong> Check basic connectivity to the API</li>
          <li><strong>Test CORS:</strong> Check cross-origin request permissions</li>
          <li><strong>Test Sample JWT:</strong> Use the exact JWT from documentation</li>
          <li><strong>Test Payment:</strong> Test actual payment creation with debug JWT</li>
          <li><strong>Clear Logs:</strong> Clear the debug output</li>
        </ol>
        <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
          Always check both this output and browser console (F12) for complete information.
        </p>
      </div>
    </div>
  );
};

export default PaymentDebug;