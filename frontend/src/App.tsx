import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './context';
import LoginForm from './components/auth/LoginForm';

// Simple dashboard placeholder
const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
      <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 dark:bg-gray-800/40 dark:border-gray-700/20 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
          <span className="text-white font-bold text-2xl">✅</span>
        </div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Login Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Welcome to the School Payment Dashboard
        </p>
        <div className="bg-green-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-200/50 dark:bg-green-900/20 dark:border-green-800/50">
          <p className="text-green-700 dark:text-green-300 text-sm">
            🎉 Your beautiful login form is working perfectly! Dashboard coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

// Register placeholder
const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
      <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 dark:bg-gray-800/40 dark:border-gray-700/20 text-center max-w-md w-full mx-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
          <span className="text-white font-bold text-2xl">📝</span>
        </div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Register Page
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Registration form coming soon!
        </p>
        <a
          href="/login"
          className="inline-flex items-center px-6 py-3 border-2 border-transparent text-sm font-medium rounded-xl text-purple-600 bg-purple-50 hover:bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 transition-all duration-300 transform hover:scale-105"
        >
          Back to Login
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
      </div>
    </div>
  );
};

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-red-900 dark:to-pink-900 flex items-center justify-center">
          <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 dark:bg-gray-800/40 dark:border-gray-700/20 text-center max-w-md w-full mx-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
              <span className="text-white font-bold text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <div className="App">
            <Routes>
              {/* Default route redirects to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Authentication routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<Register />} />
              
              {/* Dashboard route */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Catch all route redirects to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </AppProviders>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;