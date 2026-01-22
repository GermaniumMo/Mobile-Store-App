import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { getAndroidProducts } from '../../api/product.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';
import ProductCard from '../../components/ProductCard';

const AndroidProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAndroid = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getAndroidProducts();
        // Handle paginated response from Laravel
        const data = res.data.data || res.data.products || [];
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load Android products');
      } finally {
        setLoading(false);
      }
    };
    fetchAndroid();
  }, []);

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Android Phones</Text>
        {loading ? <Loader /> : null}
        {error ? <ErrorView message={error} /> : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { id: item.id })} />
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
  },
  headerContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default AndroidProductsScreen;
