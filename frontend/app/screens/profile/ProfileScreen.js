import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getItem } from '../../utils/storage';
import useAuth from '../../auth/useAuth';
import { getMe } from '../../api/auth.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const ProfileScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUserProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const userStr = await getItem('user');
      if (userStr) {
  if (typeof userStr === 'string') {
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      return;
    } catch (e) {
      console.warn('Stored user is invalid JSON, clearing it');
    }
  } else if (typeof userStr === 'object') {
    // 🔥 Handles legacy bad storage
    setUser(userStr);
    return;
  }
}

      
      // Fallback: try to fetch user from API
      try {
        const res = await getMe();
        const userData = res.data?.data || res.data?.user;
        if (userData) {
          setUser(userData);
        } else {
          setError('Failed to load profile');
        }
      } catch (apiErr) {
        if (userStr) {
          setError('Failed to parse user data');
        } else {
          setError('User not logged in');
        }
        console.error('API error:', apiErr);
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load profile on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  // Refresh profile when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [loadUserProfile])
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
              // The StackNavigator will automatically redirect to Auth when user is null
            } catch (err) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  if (loading) return <Loader />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>My Profile</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <ErrorView message={error} />
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadUserProfile}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : user ? (
        <>
          <View style={styles.userCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <Text style={styles.userName}>{user.name || 'N/A'}</Text>
            <Text style={styles.userEmail}>{user.email || 'N/A'}</Text>
            <Text style={styles.userRole}>
              {user.role === 'admin' ? 'Admin' : 'Customer'}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{user.name || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{user.phone || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{user.address || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.actionButtonText}>View My Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.notLoggedIn}>
          <Text style={styles.notLoggedInText}>Please log in to view your profile</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerSection: {
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  userRole: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    paddingBottomWidth: 1,
    paddingBottom: 12,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#222',
    flex: 1,
    textAlign: 'right',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#F44336',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  notLoggedInText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
