
import React from 'react';
import { cn } from '@/lib/utils';

interface BlurBackgroundProps {
  className?: string;
  variant?: 'default' | 'admin' | 'employee';
}

const BlurBackground: React.FC<BlurBackgroundProps> = ({ className, variant = 'default' }) => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <div className={cn('absolute inset-0', className)}>
        {/* Gradient circles with animation based on variant */}
        {variant === 'default' && (
          <>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/20 animate-float mix-blend-multiply blur-3xl" />
            <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-primary/10 animate-float mix-blend-multiply blur-3xl" style={{ animationDelay: '-2s' }} />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/40 animate-float mix-blend-multiply blur-3xl" style={{ animationDelay: '-4s' }} />
          </>
        )}

        {variant === 'admin' && (
          <>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/30 animate-float mix-blend-multiply blur-3xl" />
            <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-indigo-600/20 animate-float mix-blend-multiply blur-3xl" style={{ animationDelay: '-2s' }} />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-400/30 animate-float mix-blend-multiply blur-3xl" style={{ animationDelay: '-4s' }} />
          </>
        )}

        {variant === 'employee' && (
          <>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/30 animate-float mix-blend-multiply blur-3xl" />
            <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-emerald-600/20 animate-float mix-blend-multiply blur-3xl" style={{ animationDelay: '-2s' }} />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-400/30 animate-float mix-blend-multiply blur-3xl" style={{ animationDelay: '-4s' }} />
          </>
        )}
      </div>
    </div>
  );
};

export default BlurBackground;
