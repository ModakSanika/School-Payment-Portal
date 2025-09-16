import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Combined context providers for the entire application
 * This component wraps all context providers to keep App.tsx clean
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};

// Export individual contexts and hooks for direct use
export { ThemeProvider, useTheme } from './ThemeContext';
export { AuthProvider, useAuth } from './AuthContext';

// Default export as well
export default AppProviders;