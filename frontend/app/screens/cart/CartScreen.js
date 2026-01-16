import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getCart, updateCart, removeCartItem, clearCart } from '../../api/cart.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';
import QuantitySelector from '../../components/QuantitySelector';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getCart();
        setCart(res.data.items || []);
      } catch (err) {
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleUpdate = async (itemId, quantity) => {
    setUpdating(true);
    try {
      await updateCart({ item_id: itemId, quantity });
      const res = await getCart();
      setCart(res.data.items || []);
    } catch {
      setError('Failed to update cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdating(true);
    try {
      await removeCartItem(itemId);
      setCart(cart.filter(item => item.id !== itemId));
    } catch {
      setError('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleClear = async () => {
    setUpdating(true);
    try {
      await clearCart();
      setCart([]);
    } catch {
      setError('Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {loading && <Loader />}
      {error && <ErrorView message={error} />}
      <FlatList
        data={cart}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.product.name}</Text>
            <QuantitySelector quantity={item.quantity} onChange={q => handleUpdate(item.id, q)} />
            <Text style={styles.price}>${item.product.price * item.quantity}</Text>
            <TouchableOpacity style={styles.remove} onPress={() => handleRemove(item.id)}>
              <Text style={{ color: '#fff' }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <TouchableOpacity style={styles.clear} onPress={handleClear} disabled={updating}>
        <Text style={{ color: '#fff' }}>Clear Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.checkout} onPress={() => navigation.navigate('Checkout')} disabled={cart.length === 0}>
        <Text style={{ color: '#fff' }}>Checkout</Text>
      </TouchableOpacity>
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 15,
    color: '#1976D2',
    marginVertical: 4,
  },
  remove: {
    backgroundColor: '#D32F2F',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  clear: {
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  checkout: {
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },
});

export default CartScreen;
