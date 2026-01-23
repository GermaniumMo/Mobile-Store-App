import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getOrders } from '../../api/order.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getOrders();
        // Handle paginated response from Laravel
        const data = res.data.data || res.data.orders || [];
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Orders error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Your Orders</Text>
        {error && <ErrorView message={error} />}
        
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>You haven't placed any orders. Start shopping now!</Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.item} 
              onPress={() => navigation.navigate('OrderDetailsMain', { id: item.id })}
            >
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
              <Text style={styles.total}>Total: ${Number(item?.total || 0).toFixed(2)}</Text>
              <Text style={styles.date}>
                {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
              </Text>
            </TouchableOpacity>
          ))
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
    paddingTop: 16,
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  shopButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default OrdersScreen;
