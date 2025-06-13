import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save to state
        setToken(token);
        setUser(user);
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return true;
      } else {
        setError(response.data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password
      });
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        setError(response.data.message || 'Registration failed');
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};