import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { createOrder } from '../../api/order.api';
import { getCart } from '../../api/cart.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const CheckoutScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart();
        const items = res.data.items || res.data.data?.items || [];
        setCartItems(Array.isArray(items) ? items : []);
        const cartTotal = (Array.isArray(items) ? items : []).reduce(
          (sum, item) => sum + Number(item?.product?.price || item?.price || 0) * Number(item?.quantity || 0),
          0
        );
        setTotal(cartTotal);
      } catch (err) {
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!phone || !address) {
      Alert.alert('Error', 'Please fill in phone and address');
      return;
    }
    setError('');
    setCartLoading(true);
    try {
      await createOrder({ phone, address });
      Alert.alert('Success', 'Order placed successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Home') }
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Order Summary</Text>
        {error && <ErrorView message={error} />}
        
        {/* Cart Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items ({cartItems.length})</Text>
          {cartItems.length === 0 ? (
            <Text style={styles.emptyText}>No items in cart</Text>
          ) : (
            cartItems.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.product?.name || 'Product'}</Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  ${ (Number(item?.product?.price || item?.price || 0) * Number(item?.quantity || 0)).toFixed(2) }
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Delivery Address"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${Number(total || 0).toFixed(2)}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.button, cartLoading && styles.buttonDisabled]} 
        onPress={handleCheckout} 
        disabled={cartLoading}
      >
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemQty: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  addressInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  totalSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  button: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CheckoutScreen;
