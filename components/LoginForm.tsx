
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LockIcon, MailIcon, ShieldCheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [staggeredShow, setStaggeredShow] = useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setStaggeredShow(true);
    }, 400);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Here you would navigate to dashboard or handle errors
      console.log('Login submitted with:', { email, password });
    }, 1500);
  };

  return (
    <div className={cn(
      'w-full max-w-sm transition-all duration-1000',
      staggeredShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      className
    )}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="email"
              placeholder="employee@company.com"
              className="pl-10 h-14 bg-white/70 backdrop-blur-sm border-muted"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="password"
              placeholder="Password"
              className="pl-10 h-14 bg-white/70 backdrop-blur-sm border-muted"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-14 text-base font-medium transition-all duration-300 bg-accent hover:bg-accent/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-5 h-5 border-2 border-white border-opacity-50 border-t-white rounded-full mr-2" /> 
              Verifying...
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
        
        <div className="text-center">
          <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200">
            Forgot password?
          </a>
        </div>

        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center text-xs text-muted-foreground">
            <ShieldCheckIcon className="w-3 h-3 mr-1" />
            <span>Secure Employee Login</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
