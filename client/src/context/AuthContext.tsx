import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing login on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const username = localStorage.getItem('username');
      
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
          pincode: '560001'
        });
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

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
        pincode: '560001'
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
        pincode: null
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
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    isLoading
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