import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../api/client.js';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const AdminUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/admin/users');
        const userData = res.data.data || res.data.users || [];
        setUsers(Array.isArray(userData) ? userData : []);
      } catch (err) {
        setError('Failed to load users');
        console.error('Users error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on role
  let filteredUsers = users;
  if (filterRole !== 'all') {
    filteredUsers = users.filter(u => u.role === filterRole);
  }

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>User Management</Text>
        {error && <ErrorView message={error} />}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{adminCount}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userCount}</Text>
            <Text style={styles.statLabel}>Customers</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Filter by Role</Text>
          <View style={styles.filterButtons}>
            {[
              { id: 'all', label: 'All Users' },
              { id: 'admin', label: 'Admins' },
              { id: 'user', label: 'Customers' },
            ].map(f => (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.filterButton,
                  filterRole === f.id && styles.filterButtonActive
                ]}
                onPress={() => setFilterRole(f.id)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterRole === f.id && styles.filterButtonTextActive
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Users List */}
        {filteredUsers.length > 0 ? (
          <View style={styles.usersContainer}>
            {filteredUsers.map(user => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userHeader}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatar}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <View style={[
                    styles.roleBadge,
                    user.role === 'admin' ? styles.adminBadge : styles.userBadge
                  ]}>
                    <Text style={styles.roleBadgeText}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Text>
                  </View>
                </View>
                <View style={styles.userDetails}>
                  {user.phone && (
                    <Text style={styles.detailText}>📱 {user.phone}</Text>
                  )}
                  {user.address && (
                    <Text style={styles.detailText}>📍 {user.address}</Text>
                  )}
                  <Text style={styles.detailText}>
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.userActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="edit" size={18} color="#1976D2" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                    <MaterialIcons name="delete" size={18} color="#F44336" />
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  usersContainer: {
    gap: 12,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adminBadge: {
    backgroundColor: '#E3F2FD',
  },
  userBadge: {
    backgroundColor: '#F3E5F5',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1976D2',
  },
  userDetails: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1976D2',
    gap: 4,
  },
  deleteButton: {
    borderColor: '#F44336',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
  },
  deleteButtonText: {
    color: '#F44336',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default AdminUsersScreen;
