import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/api/me`);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load user:', error);
          // Token might be invalid, clear it
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signup = async (email, password, fullName) => {
    try {
      const response = await axios.post(`${API_URL}/api/signup`, {
        email,
        password,
        full_name: fullName,
      });

      const { access_token, user: userData } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.detail || 'Signup failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });

      const { access_token, user: userData } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
