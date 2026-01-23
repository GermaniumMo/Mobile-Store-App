import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { adminGetUsers, adminUpdateUser, adminDeleteUser } from '../../api/admin.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const AdminUsersManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterAndSearch();
  }, [users, search, roleFilter]);
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetUsers();
      const data = res.data?.data || res.data?.users || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load users');
      console.error('Users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearch = () => {
    let filtered = users;

    // Search filter
    if (search) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    try {
      if (editingUser) {
        await adminUpdateUser(editingUser.id, formData);
        setShowModal(false);
        loadUsers();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save user');
      console.error('Save error:', err);
    }
  };

  const handleDelete = (user) => {
    console.log('handleDelete called for user:', user?.id || user?._id);
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    console.log('Delete confirmed, making API call for user:', userToDelete.id || userToDelete._id);
    setShowDeleteConfirm(false);
    setDeleting(true);
    try {
      const id = userToDelete.id || userToDelete._id;
      const response = await adminDeleteUser(id);
      console.log('Delete success:', response);
      setError('');
      setUserToDelete(null);
      Alert.alert('Success', 'User deleted successfully');
      loadUsers();
    } catch (err) {
      console.error('Delete error full:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
      setError('Failed to delete: ' + errorMsg);
      Alert.alert('Error', 'Failed to delete user:\n' + errorMsg);
      setUserToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteUser = () => {
    console.log('Delete cancelled');
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };


  if (loading) return <Loader />;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.header}>Users Management</Text>
        </View>

        {error ? <ErrorView message={error} /> : null}

        {/* Search and Filters */}
        <View style={styles.filterSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.roleFilters}>
            {['all', 'user', 'admin'].map(role => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.filterButton,
                  roleFilter === role && styles.filterButtonActive
                ]}
                onPress={() => setRoleFilter(role)}
              >
                <Text style={[
                  styles.filterButtonText,
                  roleFilter === role && styles.filterButtonTextActive
                ]}>
                  {role === 'all' ? 'All' : role.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Users Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.nameCell]}>Name</Text>
            <Text style={[styles.tableCell, styles.emailCell]}>Email</Text>
            <Text style={[styles.tableCell, styles.roleCell]}>Role</Text>
            <Text style={[styles.tableCell, styles.actionCell]}>Actions</Text>
          </View>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <View key={user.id || user._id || user.email} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.nameCell]} numberOfLines={1}>{user.name}</Text>
                <Text style={[styles.tableCell, styles.emailCell]} numberOfLines={1}>{user.email}</Text>
                <Text style={[styles.tableCell, styles.roleCell]}>
                  <Text style={user.role === 'admin' ? styles.adminRole : styles.userRole}>
                    {user.role.toUpperCase()}
                  </Text>
                </Text>
                <View style={[styles.tableCell, styles.actionCell, styles.actionButtons]}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleEdit(user)}
                  >
                    <MaterialIcons name="edit" size={16} color="#fff" />
                  </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deleteBtn, deleting && styles.disabledBtn]}
                      onPress={() => {
                        console.log('Delete button pressed for user:', user.id || user._id, user.email);
                        setUserToDelete(user);
                        setShowDeleteConfirm(true);
                      }}
                      disabled={deleting}
                      accessibilityLabel={`delete-user-${user.id || user._id || user.email}`}
                    >
                      <MaterialIcons name="delete" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No users found</Text>
          )}
        </View>

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(currentPage - 1)}
              style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
            >
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.paginationInfo}>
              Page {currentPage} of {totalPages}
            </Text>
            <TouchableOpacity
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage(currentPage + 1)}
              style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
            >
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal for Edit */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit User</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.formLabel}>Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter user name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <Text style={styles.formLabel}>Email *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter user email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                editable={false}
              />

              <Text style={styles.formLabel}>Role</Text>
              <View style={styles.roleButtons}>
                {['user', 'admin'].map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleButton,
                      formData.role === role && styles.roleButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, role })}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      formData.role === role && styles.roleButtonTextActive
                    ]}>
                      {role.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Delete User</Text>
            <Text style={styles.confirmMessage}>
              Are you sure you want to delete "{userToDelete?.name}"?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelConfirmButton]}
                onPress={cancelDeleteUser}
              >
                <Text style={styles.cancelConfirmButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.deleteConfirmButton]}
                onPress={() => {
                  console.log('Delete confirm button pressed for user:', userToDelete?.id || userToDelete?._id);
                  confirmDeleteUser();
                }}
                disabled={deleting}
              >
                <Text style={styles.deleteConfirmButtonText}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSection: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  roleFilters: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
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
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#0D47A1',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 12,
    color: '#333',
  },
  nameCell: {
    flex: 1.5,
  },
  emailCell: {
    flex: 2,
  },
  roleCell: {
    flex: 1,
    textAlign: 'center',
  },
  actionCell: {
    flex: 1.2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelConfirmButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelConfirmButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteConfirmButton: {
    backgroundColor: '#D32F2F',
  },
  deleteConfirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  adminRole: {
    color: '#F57C00',
    fontWeight: '600',
    fontSize: 11,
  },
  userRole: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 11,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#999',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1976D2',
    borderRadius: 4,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  paginationInfo: {
    fontWeight: '600',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AdminUsersManagementScreen;
