import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
        // Handle both response formats
        const items = res.data.items || res.data.data?.items || [];
        setCart(Array.isArray(items) ? items : []);
      } catch (err) {
        setError('Failed to load cart');
        console.error('Cart error:', err);
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
      const items = res.data.items || res.data.data?.items || [];
      setCart(Array.isArray(items) ? items : []);
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

  const total = cart.reduce(
    (sum, item) => sum + Number(item?.product?.price || item?.price || 0) * Number(item?.quantity || 0),
    0
  );

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      {error && <ErrorView message={error} />}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Your Cart</Text>
        
        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={styles.emptySubtext}>Add some products to get started!</Text>
            <TouchableOpacity 
              style={styles.continueShoppingBtn} 
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cart.map(item => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.name}>{item.product?.name || 'Product'}</Text>
                <QuantitySelector quantity={item.quantity} onChange={q => handleUpdate(item.id, q)} />
                <Text style={styles.price}>
                  ${ (Number(item?.product?.price || item?.price || 0) * Number(item?.quantity || 0)).toFixed(2) }
                </Text>
                <TouchableOpacity style={styles.remove} onPress={() => handleRemove(item.id)}>
                  <Text style={{ color: '#fff' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <Text style={styles.total}>Total: ${Number(total || 0).toFixed(2)}</Text>
          </>
        )}
      </ScrollView>

      {cart.length > 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clear} onPress={handleClear} disabled={updating}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Clear Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkout} onPress={() => navigation.navigate('CheckoutMain')} disabled={updating}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  continueShoppingBtn: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
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
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clear: {
    flex: 1,
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkout: {
    flex: 1,
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default CartScreen;
