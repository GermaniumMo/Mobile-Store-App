import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput } from 'react-native';
import { getAndroidProducts, searchProducts } from '../../api/product.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';
import ProductCard from '../../components/ProductCard';

const AndroidProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAndroid = async () => {
      setLoading(true);
      setError('');
      try {
        let res;
        if (search) {
          res = await searchProducts(search);
        } else {
          res = await getAndroidProducts();
        }
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
  }, [search]);

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Android Phones</Text>
        <TextInput
          style={styles.search}
          placeholder="Search Android products..."
          value={search}
          onChangeText={setSearch}
        />
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
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  columnWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default AndroidProductsScreen;
