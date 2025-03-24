import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRetailer: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  registerAsRetailer: (retailerData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRetailer, setIsRetailer] = useState(false);

  // Check for existing login on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const username = localStorage.getItem('username');
      const userRole = localStorage.getItem('userRole') || 'customer';
      
      if (isLoggedIn && username) {
        // In a real app, we would validate the token with the backend
        // and fetch the user details
        
        // For demo, we'll use mock data
        setUser({
          id: 1,
          name: 'Demo User',
          username: username,
          email: 'user@example.com',
          password: '', // Don't store password in frontend context
          phone: '+91 9876543210',
          address: '201, Maple Heights, MG Road',
          city: 'Bangalore',
          pincode: '560001',
          role: userRole
        });
        setIsAuthenticated(true);
        setIsRetailer(userRole === 'retailer');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Update isRetailer whenever user changes
  useEffect(() => {
    if (user) {
      setIsRetailer(user.role === 'retailer');
    } else {
      setIsRetailer(false);
    }
  }, [user?.role]);

  // Sign in a user
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, we would make an API call to authenticate
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // });
      
      // if (!response.ok) throw new Error('Login failed');
      // const userData = await response.json();
      
      // For demo, we'll simulate a successful login with any credentials
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      const userData = {
        id: 1,
        name: 'Demo User',
        username: username,
        email: 'user@example.com',
        password: '', // Don't store password in frontend context
        phone: '+91 9876543210',
        address: '201, Maple Heights, MG Road',
        city: 'Bangalore',
        pincode: '560001',
        role: 'customer'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  // Register a new user
  const signup = async (userData: any) => {
    setIsLoading(true);
    
    try {
      // In a real app, we would make an API call to register
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      
      // if (!response.ok) throw new Error('Signup failed');
      // const newUserData = await response.json();
      
      // For demo, we'll simulate a successful signup
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const newUserData = {
        id: 1,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: '', // Don't store password in frontend context
        phone: userData.phone,
        address: null,
        city: null,
        pincode: null,
        role: 'customer'
      };
      
      setUser(newUserData);
      setIsAuthenticated(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', userData.username);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  // Log out a user
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsRetailer(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
  };
  
  // Register as a retailer
  const registerAsRetailer = async (retailerData: any) => {
    setIsLoading(true);
    
    try {
      // In a real app, we would make an API call to register the retailer
      // const response = await fetch('/api/retailers/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...retailerData, userId: user?.id }),
      // });
      
      // if (!response.ok) throw new Error('Retailer registration failed');
      // const retailerResponse = await response.json();
      
      // For demo, we'll simulate a successful retailer registration
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API delay
      
      if (!user) throw new Error('User must be logged in to register as retailer');
      
      const updatedUser = {
        ...user,
        role: 'retailer'
      };
      
      setUser(updatedUser);
      setIsRetailer(true);
      localStorage.setItem('userRole', 'retailer');
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Retailer registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isRetailer,
    login,
    signup,
    logout,
    isLoading,
    registerAsRetailer
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}