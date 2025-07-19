'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { StrapiUser } from '@/lib/utils';
import { userManager, tokenManager, authAPI } from '@/lib/utils';

interface AuthContextType {
  user: StrapiUser | null;
  token: string | null;
  login: (identifier: string, password: string, remember?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<StrapiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      const storedUser = userManager.getUser();
      const storedToken = tokenManager.getToken();

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (identifier: string, password: string, remember: boolean = false): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(identifier, password);
      
      // Store user and token
      tokenManager.setToken(response.jwt, remember);
      userManager.setUser(response.user, remember);
      
      setUser(response.user);
      setToken(response.jwt);
    } catch (err: any) {
      const errorMessage = err.error?.message || 'حدث خطأ أثناء تسجيل الدخول';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(username, email, password);
      
      // Store user and token
      tokenManager.setToken(response.jwt);
      userManager.setUser(response.user);
      
      setUser(response.user);
      setToken(response.jwt);
    } catch (err: any) {
      const errorMessage = err.error?.message || 'حدث خطأ أثناء إنشاء الحساب';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    tokenManager.removeToken();
    userManager.removeUser();
    setUser(null);
    setToken(null);
    setError(null);
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await authAPI.forgotPassword(email);
    } catch (err: any) {
      const errorMessage = err.error?.message || 'حدث خطأ أثناء إرسال البريد الإلكتروني';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    forgotPassword,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};