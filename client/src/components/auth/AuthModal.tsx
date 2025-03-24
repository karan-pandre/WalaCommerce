import { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup' | 'retailer';
}

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'retailer'>(defaultTab);
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLoginSuccess = async (username: string) => {
    const success = await login(username, 'password'); // In a real app, this would come from the form
    
    if (success) {
      toast({
        title: 'Welcome back!',
        description: `You've successfully logged in.`,
      });
      onClose();
      
      // Redirect to appropriate page based on login type
      if (activeTab === 'retailer') {
        setLocation('/retailer');
      } else {
        setLocation('/');
      }
    }
  };

  const handleSignupSuccess = async (username: string) => {
    const success = await signup({
      username,
      // Other fields would come from the form in a real app
    });
    
    if (success) {
      toast({
        title: 'Account created!',
        description: 'Your account has been successfully created.',
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden" aria-describedby="auth-description">
        <div className="p-6">
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            {activeTab === 'login' 
              ? 'Welcome Back' 
              : activeTab === 'retailer' 
                ? 'Business Portal Login' 
                : 'Create an Account'}
          </DialogTitle>
          <p id="auth-description" className="sr-only">
            {activeTab === 'login' 
              ? 'Sign in to your account' 
              : activeTab === 'retailer' 
                ? 'Log in to your business portal' 
                : 'Create a new account'}
          </p>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'login' | 'signup' | 'retailer')}
            className="mt-6"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="retailer">Business</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0">
              <LoginForm onSuccess={handleLoginSuccess} />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <button 
                    className="text-primary hover:underline font-medium"
                    onClick={() => setActiveTab('signup')}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0">
              <SignupForm onSuccess={handleSignupSuccess} />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <button 
                    className="text-primary hover:underline font-medium"
                    onClick={() => setActiveTab('login')}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="retailer" className="mt-0">
              <LoginForm onSuccess={handleLoginSuccess} />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Login to access your business portal and manage bulk orders. 
                </p>
                <div className="flex items-center justify-center mb-4">
                  <Building2 className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium">Business Portal Access</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-sm"
                  onClick={() => setLocation('/retailer/register')}
                >
                  Register as a new retailer
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogClose className="absolute top-4 right-4">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;