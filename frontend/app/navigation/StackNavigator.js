import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import IOSProductsScreen from '../screens/IOSProductsScreen';
import AndroidProductsScreen from '../screens/AndroidProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

// Create a Stack Navigator
const Stack = createStackNavigator();

// Main stack navigation for Home -> Product List -> Product Details
export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Home Screen */}
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* iOS Products List */}
      <Stack.Screen name="IOSProducts" component={IOSProductsScreen} options={{ title: 'iOS Phones' }} />
      {/* Android Products List */}
      <Stack.Screen name="AndroidProducts" component={AndroidProductsScreen} options={{ title: 'Android Phones' }} />
      {/* Product Details */}
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product Details' }} />
    </Stack.Navigator>
  );
}
