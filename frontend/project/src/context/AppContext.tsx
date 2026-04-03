import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of the user object and the context
interface User {
  name: string;
  email: string;
  role: 'customer' | 'agent';
}

interface AppContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

// Create the context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the props for the provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!token;

  // Function to handle user login
  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // On initial load, verify token if it exists (optional advanced step)
  // For now, we trust the localStorage data
  
  return (
    <AppContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};