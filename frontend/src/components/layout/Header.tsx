import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  Menu,
  
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser] = useState(() => {
    // Get user from localStorage or fallback to demo
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Demo User',
      email: 'demo@school.com',
      role: 'Administrator'
    };
  });

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth');
    
    // Clear any session data
    sessionStorage.clear();
    
    // Show logout confirmation
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      // Redirect to login page
      navigate('/login', { replace: true });
      
      // Optional: Show success message
      console.log('User logged out successfully');
    }
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') return 'Dashboard Overview';
    if (path.includes('/transactions') && !path.includes('/transaction-status')) return 'All Transactions';
    if (path.includes('/create-payment')) return 'Create Payment';
    if (path.includes('/transaction-status')) return 'Transaction Status';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/schools')) return 'Schools Management';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/help')) return 'Help & Support';
    return 'Dashboard';
  };

  const mockNotifications = [
    { id: 1, title: 'Payment Received', message: 'New payment of ₹5,500 from DPS School', time: '5 min ago', unread: true },
    { id: 2, title: 'Transaction Failed', message: 'Payment failed for Ryan International', time: '15 min ago', unread: true },
    { id: 3, title: 'Weekly Report', message: 'Your weekly payment report is ready', time: '1 hour ago', unread: false }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
      if (!target.closest('.notifications-menu')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left side - Sidebar toggle + Page title */}
          <div className="flex items-center space-x-4">
            
            {/* Sidebar Toggle Button - Made More Visible */}
            <button
              onClick={onToggleSidebar}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 group"
              aria-label="Toggle sidebar"
            >
              {/* Enhanced Hamburger Menu Icon */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="flex flex-col justify-center items-center w-6 h-6 transform transition-all duration-300 origin-center overflow-hidden">
                  <div className={`bg-current h-0.5 w-6 transform transition-all duration-300 origin-left ${isSidebarOpen ? 'translate-x-10' : ''}`}></div>
                  <div className={`bg-current h-0.5 w-6 rounded transform transition-all duration-300 ${isSidebarOpen ? 'rotate-45' : ''} delay-75`}></div>
                  <div className={`bg-current h-0.5 w-6 transform transition-all duration-300 origin-left ${isSidebarOpen ? '-rotate-45' : ''} delay-150`}></div>
                </div>
              </div>
            </button>

            {/* Page Title */}
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Center - Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions, schools..."
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Search */}
            <button className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative notifications-menu">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 ${
                          notification.unread 
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' 
                            : 'border-transparent'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative user-menu">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser.email}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">{currentUser.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/dashboard/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Account Settings
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/dashboard/help');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Bell className="w-4 h-4 mr-3" />
                      Help & Support
                    </button>
                  </div>

                  {/* Logout Section */}
                  <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;