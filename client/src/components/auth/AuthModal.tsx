import { useState } from 'react';
import { useLocation } from 'wouter';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSuccessfulAuth = (username: string, isLogin: boolean) => {
    // In a real app, we would store the auth token/user info in local storage or context
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    
    onClose();
    
    toast({
      title: isLogin ? 'Welcome back!' : 'Account created!',
      description: isLogin 
        ? `You've successfully logged in as ${username}` 
        : `Your new account has been created. Welcome to Wala!`,
      duration: 3000,
    });
    
    // Refresh the page to update auth state across the app
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogTitle className="px-6 pt-6">
          {activeTab === 'login' ? 'Sign In to Your Account' : 'Create an Account'}
        </DialogTitle>
        <DialogDescription className="px-6">
          {activeTab === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Fill in your details to create a new account'}
        </DialogDescription>

        <div className="pt-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="px-6 pb-6">
              <LoginForm onSuccess={(username) => handleSuccessfulAuth(username, true)} />
            </TabsContent>
            <TabsContent value="signup" className="px-6 pb-6">
              <SignupForm onSuccess={(username) => handleSuccessfulAuth(username, false)} />
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