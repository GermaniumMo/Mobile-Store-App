import React from 'react';
import useAuth from './useAuth';
import { View, Text } from 'react-native';

const RoleGuard = ({ role: requiredRole, children }) => {
  const { role, loading } = useAuth();

  if (loading) return null;
  if (role !== requiredRole) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 18 }}>Access Denied</Text>
      </View>
    );
  }
  return children;
};

export default RoleGuard;
