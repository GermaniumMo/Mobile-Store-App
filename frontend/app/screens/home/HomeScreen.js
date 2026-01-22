import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { getFeaturedProducts, getProducts } from '../../api/product.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';
import ProductCard from '../../components/ProductCard';
import Carousel from '../../components/Carousel';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('featured');
  const [filters] = useState([
    { id: 'featured', label: 'Featured' },
    { id: 'all', label: 'All Products' },
    { id: 'ios', label: 'iOS' },
    { id: 'android', label: 'Android' },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        // Load all products first
        let response;
        if (selectedFilter === 'featured') {
          response = await getFeaturedProducts();
        } else if (selectedFilter === 'all') {
          response = await getProducts();
        } else if (selectedFilter === 'ios' || selectedFilter === 'android') {
          response = await getProducts();
        }

        const data = response.data.data || response.data.products || [];
        let filteredData = Array.isArray(data) ? data : [];

        // Apply platform filter if needed
        if (selectedFilter === 'ios') {
          filteredData = filteredData.filter(p => p.platform === 'ios');
        } else if (selectedFilter === 'android') {
          filteredData = filteredData.filter(p => p.platform === 'android');
        }

        setProducts(filteredData);
        setAllProducts(filteredData);
      } catch (err) {
        setError('Failed to load products');
        console.error('Products error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedFilter]);

  // Extract images for carousel - build full URLs if needed
  const images = products
    .slice(0, 5)
    .map(p => {
      const imgUrl = p.primary_image || p.image;
      if (!imgUrl) return null;
      // If URL doesn't start with http, assume it's a relative path and build full URL
      if (imgUrl && !imgUrl.startsWith('http')) {
        return `http://127.0.0.1:8000/storage/${imgUrl}`;
      }
      return imgUrl;
    })
    .filter(Boolean);

  const renderFilter = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        selectedFilter === filter.id && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter.id && styles.filterButtonTextActive
        ]}
      >
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>Mobile Store</Text>
        {loading ? <Loader /> : null}
        {error ? <ErrorView message={error} /> : null}
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={item => item.id}
          renderItem={({ item }) => renderFilter(item)}
          scrollEnabled={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Carousel for featured products */}
      {!loading && images.length > 0 && selectedFilter === 'featured' ? (
        <Carousel images={images} />
      ) : null}

      {/* Products Grid */}
      <View style={styles.productsGrid}>
        {!loading && products.length > 0 ? products.map(item => (
          <View key={item.id} style={styles.productColumn}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
            />
          </View>
        )) : null}
        {!loading && products.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  filterContainer: {
    marginHorizontal: 8,
    marginBottom: 16,
  },
  filterList: {
    paddingHorizontal: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  productColumn: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  emptyContainer: {
    width: '100%',
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
