import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import IOSProductsScreen from '../screens/IOSProductsScreen';
import AndroidProductsScreen from '../screens/AndroidProductsScreen';
import AboutScreen from '../screens/AboutScreen';

// Create Drawer Navigator
const Drawer = createDrawerNavigator();

// Main drawer navigation for Home, Products, iOS, Android, About
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#fff', width: 240 },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#222',
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      {/* Home (uses StackNavigator) */}
      <Drawer.Screen name="Home" component={StackNavigator} />
      {/* iOS Phones */}
      <Drawer.Screen name="iOS Phones" component={IOSProductsScreen} />
      {/* Android Phones */}
      <Drawer.Screen name="Android Phones" component={AndroidProductsScreen} />
      {/* About */}
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
}
