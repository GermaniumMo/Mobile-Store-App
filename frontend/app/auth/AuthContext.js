import React, { createContext, useState, useEffect } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';
import { logout as logoutApi } from '../api/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedUser = await getItem('user');
        const storedToken = await getItem('token');
        const storedRole = await getItem('role');
        console.log('Auth loaded from storage:', { storedUser, storedToken, storedRole });
        if (storedUser && storedToken) {
          setUser(JSON.parse(typeof storedUser === 'string' ? storedUser : JSON.stringify(storedUser)));
          setToken(storedToken);
          setRole(storedRole || 'user');
        }
      } catch (error) {
        console.error('Error loading auth:', error);
        // Continue anyway - just don't restore auth
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async (userData, tokenValue) => {
    try {
      console.log('Logging in user:', userData);
      setUser(userData);
      setToken(tokenValue);
      setRole(userData.role || 'user');
      await setItem('user', userData);
      await setItem('token', tokenValue);
      await setItem('role', userData.role || 'user');
      console.log('User logged in successfully');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call the backend logout API to invalidate token
      await logoutApi();
    } catch (error) {
      console.error('Error calling logout API:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state and storage
      setUser(null);
      setToken(null);
      setRole('user');
      await removeItem('user');
      await removeItem('token');
      await removeItem('role');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
