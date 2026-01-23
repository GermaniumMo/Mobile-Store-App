import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { adminGetOrders, adminUpdateOrder, adminDeleteOrder } from '../../api/admin.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const AdminOrdersManagementScreen = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    status: 'pending',
  });

  const itemsPerPage = 10;
  const statuses = ['pending', 'processing', 'paid', 'shipped', 'completed', 'cancelled'];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterAndSearch();
  }, [orders, search, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetOrders();
      const data = res.data?.data || res.data?.orders || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearch = () => {
    let filtered = orders;

    // Search filter - by order ID or customer name
    if (search) {
      filtered = filtered.filter(o =>
        o.id.toString().includes(search) ||
        (o.user && o.user.name && o.user.name.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setOrderDetails(order);
    setFormData({
      status: order.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingOrder) {
        await adminUpdateOrder(editingOrder.id, formData);
        setShowModal(false);
        loadOrders();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save order');
      console.error('Save error:', err);
    }
  };

  const handleDelete = (order) => {
    Alert.alert(
      'Delete Order',
      `Are you sure you want to delete order #${order.id}?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await adminDeleteOrder(order.id);
              loadOrders();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete order');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'shipped':
        return '#2196F3';
      case 'processing':
        return '#FF9800';
      case 'pending':
        return '#F57C00';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  if (loading) return <Loader />;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.header}>Orders Management</Text>
        </View>

        {error ? <ErrorView message={error} /> : null}

        {/* Search and Filters */}
        <View style={styles.filterSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by order ID or customer..."
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.statusFilters}>
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  statusFilter === status && styles.filterButtonActive
                ]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={[
                  styles.filterButtonText,
                  statusFilter === status && styles.filterButtonTextActive
                ]}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Orders Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.idCell]}>Order ID</Text>
            <Text style={[styles.tableCell, styles.customerCell]}>Customer</Text>
            <Text style={[styles.tableCell, styles.totalCell]}>Total</Text>
            <Text style={[styles.tableCell, styles.statusCell]}>Status</Text>
            <Text style={[styles.tableCell, styles.actionCell]}>Actions</Text>
          </View>
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <View key={order.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.idCell]}>#{order.id}</Text>
                <Text style={[styles.tableCell, styles.customerCell]} numberOfLines={1}>
                  {order.user?.name || 'N/A'}
                </Text>
                <Text style={[styles.tableCell, styles.totalCell]}>
                  ${order.total_amount || 0}
                </Text>
                <Text style={[styles.tableCell, styles.statusCell]}>
                  <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Text>
                </Text>
                <View style={[styles.tableCell, styles.actionCell, styles.actionButtons]}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleEdit(order)}
                  >
                    <MaterialIcons name="edit" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(order)}
                  >
                    <MaterialIcons name="delete" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No orders found</Text>
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
              <Text style={styles.modalTitle}>Edit Order #{editingOrder?.id}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              {orderDetails && (
                <>
                  <View style={styles.orderInfoSection}>
                    <Text style={styles.sectionTitle}>Order Details</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Customer:</Text>
                      <Text style={styles.infoValue}>{orderDetails.user?.name || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Total:</Text>
                      <Text style={styles.infoValue}>${orderDetails.total_amount || 0}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Items:</Text>
                      <Text style={styles.infoValue}>
                        {orderDetails.items?.length || 0}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Date:</Text>
                      <Text style={styles.infoValue}>
                        {new Date(orderDetails.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.itemsSection}>
                    <Text style={styles.sectionTitle}>Items</Text>
                    {orderDetails.items && orderDetails.items.map((item, index) => (
                      <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemName}>{item.product?.name || 'Product'}</Text>
                        <Text style={styles.itemDetails}>
                          Qty: {item.quantity} × ${item.price}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.formLabel}>Update Status</Text>
              <View style={styles.statusButtons}>
                {statuses.map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      formData.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, status })}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.status === status && styles.statusButtonTextActive
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
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
  statusFilters: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 4,
  },
  filterButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  filterButtonText: {
    fontSize: 11,
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
  idCell: {
    flex: 0.8,
  },
  customerCell: {
    flex: 1.5,
  },
  totalCell: {
    flex: 0.8,
    textAlign: 'center',
  },
  statusCell: {
    flex: 1.2,
    justifyContent: 'center',
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    overflow: 'hidden',
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
  orderInfoSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  itemsSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  itemRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 11,
    color: '#666',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    flex: 0.45,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  statusButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  statusButtonTextActive: {
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

export default AdminOrdersManagementScreen;
