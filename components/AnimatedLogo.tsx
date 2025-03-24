
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
  variant?: 'default' | 'admin' | 'employee';
  text?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  className, 
  variant = 'default',
  text = 'E'
}) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Color variants
  const bgColors = {
    default: 'bg-accent',
    admin: 'bg-purple-600',
    employee: 'bg-teal-600'
  };

  const dotColors = {
    default: 'bg-primary',
    admin: 'bg-indigo-500',
    employee: 'bg-emerald-500'
  };

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className={cn(
        'transition-all duration-1000 ease-out transform',
        loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      )}>
        <div className="relative">
          <div className={`w-20 h-20 rounded-3xl ${bgColors[variant]} animate-pulse-subtle flex items-center justify-center`}>
            <span className="text-white text-3xl font-bold">{text}</span>
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${dotColors[variant]} rounded-full border-2 border-white`} />
        </div>
      </div>
    </div>
  );
};

export default AnimatedLogo;
