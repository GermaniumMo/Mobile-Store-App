import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import IOSProductsScreen from '../screens/products/IOSProductsScreen';
import AndroidProductsScreen from '../screens/products/AndroidProductsScreen';
import ProductDetailsScreen from '../screens/products/ProductDetailsScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import useAuth from '../auth/useAuth';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Create Drawer Navigator
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Home Stack with header
function HomeStack({ navigation }) {
  const { logout } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              logout();
            }}
            style={{ marginRight: 15 }}
          >
            <Text style={{ color: '#1976D2', fontSize: 14, fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}

// iOS Products Stack
function IOSStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="IOSScreen"
        component={IOSProductsScreen}
        options={{ title: 'iOS Phones' }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}

// Android Products Stack
function AndroidStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="AndroidScreen"
        component={AndroidProductsScreen}
        options={{ title: 'Android Phones' }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}

// About Stack
function AboutStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{ title: 'About' }}
      />
    </Stack.Navigator>
  );
}

// Cart Stack
function CartStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="CartScreenMain"
        component={CartScreen}
        options={{ title: 'My Cart' }}
      />
      <Stack.Screen
        name="CheckoutMain"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
    </Stack.Navigator>
  );
}

// Orders Stack
function OrdersStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="OrdersScreenMain"
        component={OrdersScreen}
        options={{ title: 'My Orders' }}
      />
      <Stack.Screen
        name="OrderDetailsMain"
        component={OrderDetailsScreen}
        options={{ title: 'Order Details' }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="ProfileScreenMain"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

// Admin Products Stack
function AdminProductsStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="AdminProductsScreenMain"
        component={AdminProductsScreen}
        options={{ title: 'Manage Products' }}
      />
    </Stack.Navigator>
  );
}

// Admin Orders Stack
function AdminOrdersStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="AdminOrdersScreenMain"
        component={AdminOrdersScreen}
        options={{ title: 'Manage Orders' }}
      />
    </Stack.Navigator>
  );
}

// Admin Home Stack
function AdminHomeStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="AdminHomeScreenMain"
        component={AdminHomeScreen}
        options={{ title: 'Admin Dashboard' }}
      />
    </Stack.Navigator>
  );
}

// Admin Users Stack
function AdminUsersStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
        headerTintColor: '#222',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <MaterialIcons name="menu" size={24} color="#222" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="AdminUsersScreenMain"
        component={AdminUsersScreen}
        options={{ title: 'Manage Users' }}
      />
    </Stack.Navigator>
  );
}

// Main drawer navigation for Home, Products, iOS, Android, About
export default function DrawerNavigator() {
  const { role } = useAuth();
  console.log('DrawerNavigator rendering - role:', role);
  
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
      {/* Home (uses Stack with header) */}
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => <MaterialIcons name="home" size={22} color={color} />,
        }}
      />
      {/* iOS Phones */}
      <Drawer.Screen
        name="iOS"
        component={IOSStack}
        options={{
          drawerLabel: 'iOS Phones',
          drawerIcon: ({ color }) => <MaterialIcons name="phone-iphone" size={22} color={color} />,
        }}
      />
      {/* Android Phones */}
      <Drawer.Screen
        name="Android"
        component={AndroidStack}
        options={{
          drawerLabel: 'Android Phones',
          drawerIcon: ({ color }) => <MaterialIcons name="android" size={22} color={color} />,
        }}
      />
      {/* About */}
      <Drawer.Screen
        name="About"
        component={AboutStack}
        options={{
          drawerLabel: 'About',
          drawerIcon: ({ color }) => <MaterialIcons name="info" size={22} color={color} />,
        }}
      />
      {/* Cart */}
      <Drawer.Screen
        name="Cart"
        component={CartStack}
        options={{
          drawerLabel: 'My Cart',
          drawerIcon: ({ color }) => <MaterialIcons name="shopping-cart" size={22} color={color} />,
        }}
      />
      {/* Orders */}
      <Drawer.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          drawerLabel: 'My Orders',
          drawerIcon: ({ color }) => <MaterialIcons name="receipt" size={22} color={color} />,
        }}
      />
      {/* Profile */}
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          drawerLabel: 'Profile',
          drawerIcon: ({ color }) => <MaterialIcons name="person" size={22} color={color} />,
        }}
      />
      
      {/* Admin Screens - Only show if user is admin */}
      {role === 'admin' && (
        <>
          <Drawer.Screen
            name="AdminProducts"
            component={AdminProductsStack}
            options={{
              drawerLabel: 'Admin - Products',
              drawerIcon: ({ color }) => <MaterialIcons name="inventory" size={22} color={color} />,
            }}
          />
          <Drawer.Screen
            name="AdminOrders"
            component={AdminOrdersStack}
            options={{
              drawerLabel: 'Admin - Orders',
              drawerIcon: ({ color }) => <MaterialIcons name="assignment" size={22} color={color} />,
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}
