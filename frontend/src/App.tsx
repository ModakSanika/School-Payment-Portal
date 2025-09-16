import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
//import SimpleDashboard from './components/dashboard/SimpleDashboard';
import TransactionOverview from './components/dashboard/TransactionOverview';
import TransactionDetails from './components/dashboard/TransactionDetails';
import TransactionStatus from './components/dashboard/TransactionStatus';
import CreatePayment from './components/payments/CreatePayment';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import NotFound from './components/common/NotFound';
// Import the missing pages
import { Analytics, Schools, Settings, Help } from './components/pages/MissingPages';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  console.log('ProtectedRoute - Auth check:', { isAuthenticated, user: user?.email });

  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - Rendering protected content');
  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  console.log('PublicRoute - Auth check:', { isAuthenticated, user: user?.email });

  if (isAuthenticated && user) {
    console.log('PublicRoute - User is authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('PublicRoute - Rendering public content (login)');
  return <>{children}</>;
};

// Main App Routes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  console.log('AppRoutes - Auth state:', { isAuthenticated, user: user?.email });
  
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      
      {/* Root redirect - goes to login if not authenticated, dashboard if authenticated */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                {/* Main Dashboard Route - FIXED: Uncommented */}
                <Route index element={<Dashboard />} />
                
                {/* Alternative: Use SimpleDashboard for testing */}
                {/* <Route index element={<SimpleDashboard />} /> */}
                
                {/* Existing Sub-routes */}
                <Route path="transactions" element={<TransactionOverview />} />
                <Route path="transactions/school/:schoolId" element={<TransactionDetails />} />
                <Route path="transaction-status" element={<TransactionStatus />} />
                <Route path="create-payment" element={<CreatePayment />} />
                
                {/* NEW: Missing pages that were causing empty screens */}
                <Route path="analytics" element={<Analytics />} />
                <Route path="schools" element={<Schools />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<Help />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Legacy protected routes (for direct access) */}
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard/transactions" replace />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/create-payment"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard/create-payment" replace />
          </ProtectedRoute>
        }
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
            <React.Suspense 
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <AppRoutes />
            </React.Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;