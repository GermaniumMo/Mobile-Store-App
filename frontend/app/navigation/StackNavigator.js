import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DrawerNavigator from './DrawerNavigator';
import useAuth from '../auth/useAuth';

const Stack = createStackNavigator();

export default function StackNavigator() {
  const { user, loading } = useAuth();

  console.log('StackNavigator rendering - user:', !!user, 'loading:', loading);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
        gestureEnabled: false,
      }}
    >
      {user ? (
        <Stack.Screen 
          name="MainApp" 
          component={DrawerNavigator}
        />
      ) : (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
