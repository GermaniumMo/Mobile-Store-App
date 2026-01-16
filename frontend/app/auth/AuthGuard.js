import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import useAuth from './useAuth';

const AuthGuard = ({ children, fallback = null }) => {
  const { user, loading } = useAuth();

  if (loading) return <ActivityIndicator size="large" />;
  if (!user) return fallback || null;
  return children;
};

export default AuthGuard;
