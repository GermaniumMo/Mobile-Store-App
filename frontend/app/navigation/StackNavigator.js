import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import IOSProductsScreen from '../screens/IOSProductsScreen';
import AndroidProductsScreen from '../screens/AndroidProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DrawerNavigator from './DrawerNavigator';
import AuthGuard from '../auth/AuthGuard';

// Create a Stack Navigator
const Stack = createStackNavigator();

// Main stack navigation for Home -> Product List -> Product Details
export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Public Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      {/* Private Screens (Drawer) */}
      <Stack.Screen name="Main">
        {() => (
          <AuthGuard fallback={<LoginScreen />}> <DrawerNavigator /> </AuthGuard>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
