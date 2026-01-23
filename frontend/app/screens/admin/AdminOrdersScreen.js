import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { adminGetOrders, adminUpdateOrder, adminDeleteOrder } from '../../api/admin.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const AdminOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const statuses = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'paid', label: 'Paid' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const handleDelete = async (id) => {
    Alert.alert('Delete Order', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await adminDeleteOrder(id);
          fetchOrders();
        } catch {
          setError('Failed to delete order');
        }
      }}
    ]);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminUpdateOrder(id, { status: newStatus });
      fetchOrders();
    } catch {
      setError('Failed to update order status');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin: Orders</Text>
      {loading && <Loader />}
      {error && <ErrorView message={error} />}
      
      {/* Status Filter Buttons */}
      <View style={styles.filterSection}>
        <View style={styles.filterButtons}>
          {statuses.map(status => (
            <TouchableOpacity
              key={status.id}
              style={[
                styles.filterButton,
                filter === status.id && styles.filterButtonActive
              ]}
              onPress={() => setFilter(status.id)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === status.id && styles.filterButtonTextActive
                ]}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            <Text style={styles.total}>Total: ${item.total}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.update} onPress={() => handleUpdateStatus(item.id, 'processing')}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Processing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.update} onPress={() => handleUpdateStatus(item.id, 'paid')}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Paid</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.update} onPress={() => handleUpdateStatus(item.id, 'shipped')}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Shipped</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.update} onPress={() => handleUpdateStatus(item.id, 'completed')}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancel} onPress={() => handleUpdateStatus(item.id, 'cancelled')}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Cancelled</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delete} onPress={() => handleDelete(item.id)}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 15,
    color: '#1976D2',
    marginVertical: 4,
  },
  total: {
    fontSize: 15,
    color: '#424242',
    marginVertical: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  delete: {
    backgroundColor: '#D32F2F',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    backgroundColor: '#F57C00',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  update: {
    backgroundColor: '#1976D2',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdminOrdersScreen;
