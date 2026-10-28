import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('studentx_token'));
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  // Load user profile on mount if token exists
  useEffect(() => {
    async function loadUser() {
      const savedToken = localStorage.getItem('studentx_token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          localStorage.removeItem('studentx_token');
          localStorage.removeItem('studentx_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, user: loggedUser } = res.data;

      localStorage.setItem('studentx_token', newToken);
      localStorage.setItem('studentx_user', JSON.stringify(loggedUser));
      setToken(newToken);
      setUser(loggedUser);

      success(`Welcome back, ${loggedUser.name}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const loginWithGoogle = (oauthToken, googleUser) => {
    localStorage.setItem('studentx_token', oauthToken);
    if (googleUser) {
      localStorage.setItem('studentx_user', JSON.stringify(googleUser));
      setUser(googleUser);
    }
    setToken(oauthToken);
    success('Google sign-in successful!');
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { token: newToken, user: newUser } = res.data;

      localStorage.setItem('studentx_token', newToken);
      localStorage.setItem('studentx_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);

      success('Account created successfully! Welcome to STUDENTX.');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('studentx_token');
    localStorage.removeItem('studentx_user');
    setToken(null);
    setUser(null);
    success('Logged out successfully.');
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('studentx_user', JSON.stringify(updated));
      return updated;
    });
  };

  const isAdmin = user?.role === 'ADMIN';
  const isFaculty = user?.role === 'FACULTY';
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isFaculty,
        isStudent,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

