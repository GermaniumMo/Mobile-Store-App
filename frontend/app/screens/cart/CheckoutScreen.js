import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createOrder } from '../../api/order.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const CheckoutScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setError('');
    setLoading(true);
    try {
      await createOrder({}); // Add order details if needed
      Alert.alert('Success', 'Order placed successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Orders') }
      ]);
    } catch (err) {
      setError('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      {error && <ErrorView message={error} />}
      <TouchableOpacity style={styles.button} onPress={handleCheckout} disabled={loading}>
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
      {loading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CheckoutScreen;
