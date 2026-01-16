import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getOrderDetails } from '../../api/order.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const OrderDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getOrderDetails(id);
        setOrder(res.data.order);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorView message={error} />;
  if (!order) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order #{order.id}</Text>
      <Text style={styles.status}>Status: {order.status}</Text>
      <Text style={styles.total}>Total: ${order.total}</Text>
      <Text style={styles.section}>Items</Text>
      <FlatList
        data={order.items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.product.name}</Text>
            <Text>Qty: {item.quantity}</Text>
            <Text>Price: ${item.product.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: '#1976D2',
    marginBottom: 4,
    textAlign: 'center',
  },
  total: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 8,
    textAlign: 'center',
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
});

export default OrderDetailsScreen;
