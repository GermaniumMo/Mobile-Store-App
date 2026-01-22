import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IOSProductsScreen from '../screens/products/IOSProductsScreen';
import AndroidProductsScreen from '../screens/products/AndroidProductsScreen';
import { Ionicons } from 'expo-vector-icons';

const Tab = createBottomTabNavigator();

// Tab navigation for Products section: iOS Tab and Android Tab
export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="iOS"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'iOS') {
            iconName = 'logo-apple';
          } else if (route.name === 'Android') {
            iconName = 'logo-android';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#222',
        tabBarStyle: { backgroundColor: '#fff' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="iOS" component={IOSProductsScreen} />
      <Tab.Screen name="Android" component={AndroidProductsScreen} />
    </Tab.Navigator>
  );
}
