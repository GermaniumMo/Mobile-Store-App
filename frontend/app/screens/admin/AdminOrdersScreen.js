import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { adminGetOrders, adminUpdateOrder, adminDeleteOrder } from '../../api/admin.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const AdminOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            <Text style={styles.total}>Total: ${item.total}</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity style={styles.update} onPress={() => handleUpdateStatus(item.id, 'processing')}>
                <Text style={{ color: '#fff' }}>Processing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.update} onPress={() => handleUpdateStatus(item.id, 'completed')}>
                <Text style={{ color: '#fff' }}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.update} onPress={() => handleUpdateStatus(item.id, 'cancelled')}>
                <Text style={{ color: '#fff' }}>Cancelled</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delete} onPress={() => handleDelete(item.id)}>
                <Text style={{ color: '#fff' }}>Delete</Text>
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
  delete: {
    backgroundColor: '#D32F2F',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  update: {
    backgroundColor: '#1976D2',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 6,
  },
});

export default AdminOrdersScreen;
