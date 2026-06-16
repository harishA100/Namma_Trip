import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('namma_token');
    const savedUser = localStorage.getItem('namma_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('namma_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    /*
    // REAL BACKEND CALL:
    const response = await authApi.login({ email, password });
    const { token: newToken, user: newUser } = response.data.data;
    */

    // MOCK DATA IMPLEMENTATION:
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newToken = 'mock_jwt_token_12345';
    const newUser = { id: '1', name: 'Test Explorer', email, role: 'USER' } as any;

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('namma_token', newToken);
    localStorage.setItem('namma_user', JSON.stringify(newUser));
  };

  const register = async (name: string, email: string, password: string) => {
    /*
    // REAL BACKEND CALL:
    const response = await authApi.register({ name, email, password });
    const { token: newToken, user: newUser } = response.data.data;
    */

    // MOCK DATA IMPLEMENTATION:
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newToken = 'mock_jwt_token_12345';
    const newUser = { id: '1', name, email, role: 'USER' } as any;

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('namma_token', newToken);
    localStorage.setItem('namma_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('namma_token');
    localStorage.removeItem('namma_user');
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, register, logout,
      isAuthenticated: !!token && !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
