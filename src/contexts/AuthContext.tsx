// SVAMS Auth Context
// Session/cookie-based authentication with role-based access control.
// Supports login, logout, session refresh, and permission checks.

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { apiService, isSessionExpired, clearSession } from '../api/service';
import type { User, Role, LoginCredentials, LoginResponse } from '../api/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  csrfToken: string | null;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      try {
        if (!isSessionExpired()) {
          const currentUser = await apiService.getCurrentUser();
          if (mounted) {
            setUser(currentUser);
          }
        } else {
          clearSession();
        }
      } catch (err) {
        console.warn('Auth init failed:', err);
        clearSession();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    initAuth();
    return () => { mounted = false; };
  }, []);

  // Session refresh interval
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      apiService.refreshSession().catch(() => {
        // Silent fail - will redirect on next action
      });
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await apiService.login(credentials);
      setUser(response.user);
      setCsrfToken(response.csrfToken);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      setUser(null);
      setCsrfToken(null);
      clearSession();
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const ok = await apiService.refreshSession();
    if (ok) {
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);
    } else {
      setUser(null);
      setCsrfToken(null);
      clearSession();
    }
    return ok;
  }, []);

  const hasPermission = useCallback((resource: string, action: string): boolean => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    const permission = user.permissions.find(p => p.resource === resource || p.resource === '*');
    return !!permission && permission.actions.includes(action as any);
  }, [user]);

  const hasRole = useCallback((...roles: Role[]): boolean => {
    return !!user && roles.includes(user.role);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    csrfToken,
    login,
    logout,
    refreshSession,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}