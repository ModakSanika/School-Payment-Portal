import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  variant = 'default',
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseInputStyles = [
    'block px-3 py-2 text-sm placeholder-gray-500 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    'dark:disabled:bg-gray-800 dark:disabled:text-gray-400'
  ];

  const variants = {
    default: [
      'border border-white/30 rounded-lg bg-white/70 backdrop-blur-sm text-gray-900',
      'focus:ring-purple-500 focus:border-purple-500 focus:bg-white/90',
      'dark:bg-gray-800/70 dark:border-gray-600/30 dark:text-gray-100',
      'dark:focus:ring-purple-400 dark:focus:border-purple-400 dark:focus:bg-gray-800/90'
    ],
    filled: [
      'border-0 rounded-lg bg-gray-100/70 backdrop-blur-sm text-gray-900',
      'focus:ring-purple-500 focus:bg-white/90',
      'dark:bg-gray-700/70 dark:text-gray-100',
      'dark:focus:bg-gray-700/90 dark:focus:ring-purple-400'
    ],
    outlined: [
      'border-2 border-purple-300/50 rounded-lg bg-transparent backdrop-blur-sm text-gray-900',
      'focus:ring-purple-500 focus:border-purple-500',
      'dark:border-purple-600/30 dark:text-gray-100',
      'dark:focus:ring-purple-400 dark:focus:border-purple-400'
    ]
  };

  const errorStyles = [
    'border-red-400/50 focus:ring-red-500 focus:border-red-500 bg-red-50/50',
    'dark:border-red-500/50 dark:focus:ring-red-400 dark:focus:border-red-400 dark:bg-red-900/10'
  ];

  const inputClasses = clsx(
    baseInputStyles,
    variants[variant],
    {
      [errorStyles.join(' ')]: error,
      'pl-10': leftIcon,
      'pr-10': rightIcon,
      'w-full': fullWidth
    },
    className
  );

  const containerClasses = clsx(
    'relative',
    {
      'w-full': fullWidth
    }
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            'block text-sm font-semibold mb-2 transition-colors duration-200',
            error 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={clsx(
              'w-5 h-5 transition-colors duration-200',
              error ? 'text-red-400' : 'text-purple-400 dark:text-purple-300'
            )}>
              {leftIcon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className={clsx(
              'w-5 h-5 transition-colors duration-200',
              error ? 'text-red-400' : 'text-purple-400 dark:text-purple-300'
            )}>
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 p-2 bg-red-50/80 backdrop-blur-sm rounded-lg border border-red-200/50 dark:bg-red-900/20 dark:border-red-800/50">
          <p className="text-sm text-red-700 dark:text-red-300 flex items-center font-medium">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
          <svg className="w-4 h-4 mr-2 flex-shrink-0 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;