import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Receipt, 
  Search, 
  Plus, 
  School, 
  BarChart3,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  description?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      name: 'All Transactions',
      href: '/dashboard/transactions',
      icon: Receipt,
      description: 'View all payment transactions'
    },
    {
      name: 'Transaction Status',
      href: '/dashboard/transaction-status',
      icon: Search,
      description: 'Check payment status'
    },
    {
      name: 'Create Payment',
      href: '/dashboard/create-payment',
      icon: Plus,
      description: 'Initiate new payment'
    }
  ];

  const secondaryNavigation: NavItem[] = [
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      description: 'Payment insights'
    },
    {
      name: 'Schools',
      href: '/dashboard/schools',
      icon: School,
      description: 'Manage schools'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      description: 'Account preferences'
    },
    {
      name: 'Help & Support',
      href: '/dashboard/help',
      icon: HelpCircle,
      description: 'Get assistance'
    }
  ];

  const isCurrentPath = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(href);
  };

  const NavItem: React.FC<{ item: NavItem; onClick?: () => void; isCollapsed?: boolean }> = ({ 
    item, 
    onClick, 
    isCollapsed = false 
  }) => {
    const Icon = item.icon;
    const isCurrent = isCurrentPath(item.href);

    return (
      <NavLink
        to={item.href}
        onClick={onClick}
        className={clsx(
          'group relative flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
          isCurrent
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
            : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
        )}
        title={isCollapsed ? item.name : ''}
      >
        {/* Background gradient effect for current item */}
        {isCurrent && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20"></div>
        )}
        
        <div className={clsx(
          'relative flex items-center w-full',
          isCollapsed && 'justify-center'
        )}>
          <Icon className={clsx(
            'h-5 w-5 flex-shrink-0 transition-colors',
            isCurrent ? 'text-white' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400',
            !isCollapsed && 'mr-3'
          )} />
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <span className="truncate">
                {item.name}
              </span>
              {item.description && (
                <p className={clsx(
                  'text-xs mt-1 truncate transition-colors',
                  isCurrent 
                    ? 'text-white/80' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                )}>
                  {item.description}
                </p>
              )}
            </div>
          )}

          {!isCollapsed && item.badge && (
            <span className={clsx(
              'ml-auto inline-block py-0.5 px-2 text-xs rounded-full',
              isCurrent
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            )}>
              {item.badge}
            </span>
          )}
        </div>

        {/* Active indicator */}
        {isCurrent && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
            {item.name}
          </div>
        )}
      </NavLink>
    );
  };

  if (isMobile) {
    // Mobile Sidebar
    return (
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-gray-700/50">
          
          {/* Mobile Header */}
          <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  School Pay
                </h1>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            
            {/* Primary Navigation */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Main
              </h3>
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} onClick={onClose} />
              ))}
            </div>

            {/* Secondary Navigation */}
            <div className="pt-4 space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tools
              </h3>
              {secondaryNavigation.map((item) => (
                <NavItem key={item.name} item={item} onClick={onClose} />
              ))}
            </div>
          </nav>
        </div>
      </div>
    );
  }

  // Desktop Sidebar
  return (
    <div className={clsx(
      'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out',
      isOpen ? 'w-72' : 'w-16'
    )}>
      <div className="flex flex-col flex-grow bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        
        {/* Logo Section */}
        <div className={clsx(
          'flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300',
          !isOpen && 'px-4 justify-center'
        )}>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div className="ml-3 transition-all duration-300">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  School Pay
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Payment Dashboard
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <nav className={clsx(
            'flex-1 py-6 space-y-2 overflow-y-auto custom-scrollbar transition-all duration-300',
            isOpen ? 'px-4' : 'px-2'
          )}>
            
            {/* Primary Navigation */}
            <div className="space-y-1">
              {isOpen && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Main
                </h3>
              )}
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} isCollapsed={!isOpen} />
              ))}
            </div>

            {/* Secondary Navigation */}
            <div className="pt-6 space-y-1">
              {isOpen && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tools
                </h3>
              )}
              {secondaryNavigation.map((item) => (
                <NavItem key={item.name} item={item} isCollapsed={!isOpen} />
              ))}
            </div>
          </nav>

          {/* Bottom Section */}
          {isOpen && (
            <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Need Help?
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Documentation & Support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;