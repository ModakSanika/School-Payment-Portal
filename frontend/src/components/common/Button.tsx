import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = [
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    'hover:transform hover:scale-[1.02] active:scale-[0.98]'
  ];

  const variants = {
    primary: [
      'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-lg',
      'hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 focus:ring-purple-500',
      'disabled:from-purple-300 disabled:via-pink-300 disabled:to-indigo-300'
    ],
    secondary: [
      'bg-white/80 backdrop-blur-sm text-gray-900 shadow-lg border border-white/30',
      'hover:bg-white/90 hover:shadow-xl focus:ring-gray-500',
      'dark:bg-gray-800/80 dark:text-gray-100 dark:hover:bg-gray-700/90 dark:border-gray-700/30'
    ],
    danger: [
      'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg',
      'hover:from-red-600 hover:to-pink-700 focus:ring-red-500',
      'disabled:from-red-300 disabled:to-pink-300'
    ],
    success: [
      'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
      'hover:from-green-600 hover:to-emerald-700 focus:ring-green-500',
      'disabled:from-green-300 disabled:to-emerald-300'
    ],
    outline: [
      'border-2 border-purple-500 text-purple-600 bg-transparent backdrop-blur-sm',
      'hover:bg-purple-50 hover:shadow-lg focus:ring-purple-500',
      'disabled:border-purple-300 disabled:text-purple-300',
      'dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950/20'
    ],
    ghost: [
      'text-gray-600 bg-transparent backdrop-blur-sm',
      'hover:bg-white/20 hover:text-gray-900 hover:shadow-md focus:ring-gray-500',
      'dark:text-gray-400 dark:hover:bg-gray-800/20 dark:hover:text-gray-100'
    ]
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[48px]'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    {
      'w-full': fullWidth
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className={clsx('animate-spin rounded-full border-2 border-current border-t-transparent', iconSizes[size])}>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          {leftIcon && (
            <span className={clsx(iconSizes[size], children ? 'mr-2' : '')}>
              {leftIcon}
            </span>
          )}
          {children}
          {rightIcon && (
            <span className={clsx(iconSizes[size], children ? 'ml-2' : '')}>
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;