// SimplePaymentTest.tsx
import React, { useState } from 'react';

const SimplePaymentTest: React.FC = () => {
  const [result, setResult] = useState<string>('');

  const testPaymentAPI = async () => {
    setResult('Testing...');
    
    try {
      // Test the exact API call
      const requestBody = {
        school_id: "65b0e6293e9f76a9694d84b4",
        amount: "100",
        callback_url: "http://localhost:5173/callback",
        sign: "eyJhbGciOiJIUzI1NiJ9.eyJzY2hvb2xfaWQiOiI2NWIwZTYyOTNlOWY3NmE5Njk0ZDg0YjQiLCJhbW91bnQiOiIxIiwiY2FsbGJhY2tfdXJsIjoiaHR0cHM6Ly9nb29nbGUuY29tIn0.DJ10HHluuiIc4ShhEPYEJZ2xWNpF_g1V0x2nGNcB9uk"
      };

      console.log('Making API call with:', requestBody);

      const response = await fetch('https://dev-vanilla.edviron.com/erp/create-collect-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2fQ.IJWTYCOurGCFdRM2xyKtw6TEcuwXxGnmINrXFfs'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        setResult(`API Error (${response.status}): ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('Success response:', data);
      setResult(`Success: ${JSON.stringify(data, null, 2)}`);

    } catch (error: any) {
      console.error('Network Error:', error);
      setResult(`Network Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Simple Payment API Test</h2>
      
      <button 
        onClick={testPaymentAPI}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Payment API
      </button>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Result:</h3>
        <pre className="whitespace-pre-wrap text-sm">{result}</pre>
      </div>

      <div className="mt-4 p-4 bg-yellow-100 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open browser Developer Tools (F12)</li>
          <li>Go to Console tab</li>
          <li>Click the Test button above</li>
          <li>Check both the result here and console logs</li>
        </ol>
      </div>
    </div>
  );
};

export default SimplePaymentTest;