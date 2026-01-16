import React, { createContext, useState, useEffect } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const storedUser = await getItem('user');
      const storedToken = await getItem('token');
      const storedRole = await getItem('role');
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
        setRole(storedRole || 'user');
      }
      setLoading(false);
    };
    loadAuth();
  }, []);

  const login = async (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    setRole(userData.role || 'user');
    await setItem('user', userData);
    await setItem('token', tokenValue);
    await setItem('role', userData.role || 'user');
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setRole('user');
    await removeItem('user');
    await removeItem('token');
    await removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
