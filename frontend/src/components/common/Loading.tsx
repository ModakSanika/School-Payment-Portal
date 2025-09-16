import React from 'react';
import clsx from 'clsx';

interface LoadingProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

const Loading: React.FC<LoadingProps> = ({
  type = 'spinner',
  size = 'md',
  text,
  fullScreen = false,
  className,
  color = 'primary'
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    white: 'text-white'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Spinner Loading
  const SpinnerLoading = () => (
    <div className="flex flex-col items-center justify-center">
      <div className={clsx(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizes[size],
        colors[color]
      )}>
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className={clsx('mt-3 font-medium', colors[color], textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  );

  // Dots Loading
  const DotsLoading = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              'rounded-full animate-bounce',
              colors[color],
              size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
            )}
            style={{
              backgroundColor: 'currentColor',
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
      {text && (
        <p className={clsx('mt-3 font-medium', colors[color], textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  );

  // Pulse Loading
  const PulseLoading = () => (
    <div className="flex flex-col items-center justify-center">
      <div className={clsx(
        'rounded-full animate-pulse',
        sizes[size],
        colors[color]
      )}
      style={{ backgroundColor: 'currentColor', opacity: 0.6 }}
      />
      {text && (
        <p className={clsx('mt-3 font-medium', colors[color], textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  );

  // Skeleton Loading
  const SkeletonLoading = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded dark:bg-gray-600"></div>
        <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-5/6"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-1/2"></div>
    </div>
  );

  const LoadingComponent = () => {
    switch (type) {
      case 'dots':
        return <DotsLoading />;
      case 'pulse':
        return <PulseLoading />;
      case 'skeleton':
        return <SkeletonLoading />;
      default:
        return <SpinnerLoading />;
    }
  };

  const containerClasses = clsx(
    'flex items-center justify-center',
    {
      'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 dark:bg-gray-900/80': fullScreen,
      'p-8': fullScreen,
      'py-4': !fullScreen
    },
    className
  );

  return (
    <div className={containerClasses}>
      <LoadingComponent />
    </div>
  );
};

// Skeleton loader for specific content
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className }) => (
  <div className={clsx('animate-pulse space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={clsx(
          'h-4 bg-gray-300 rounded dark:bg-gray-600',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

// Skeleton loader for cards
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('animate-pulse p-6 bg-white rounded-lg shadow dark:bg-gray-800', className)}>
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full dark:bg-gray-600"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded dark:bg-gray-600 w-1/2"></div>
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

export default Loading;