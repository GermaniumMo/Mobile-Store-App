import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { getFeaturedProducts, getProducts, searchProducts } from '../../api/product.api';
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
  const [search, setSearch] = useState('');
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
        let response;
        // If search is active, use search API
        if (search) {
          response = await searchProducts(search);
        } else if (selectedFilter === 'featured') {
          response = await getFeaturedProducts();
        } else if (selectedFilter === 'all') {
          response = await getProducts();
        } else if (selectedFilter === 'ios' || selectedFilter === 'android') {
          response = await getProducts();
        }

        const data = response.data.data || response.data.products || [];
        let filteredData = Array.isArray(data) ? data : [];

        // Apply platform filter only if not searching
        if (!search) {
          if (selectedFilter === 'ios') {
            filteredData = filteredData.filter(p => p.platform === 'ios');
          } else if (selectedFilter === 'android') {
            filteredData = filteredData.filter(p => p.platform === 'android');
          }
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
  }, [selectedFilter, search]);

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

  const renderHeader = () => (
    <>
      <View style={styles.headerSection}>
        <Text style={styles.header}>Mobile Store</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
        />
        {loading ? <Loader /> : null}
        {error ? <ErrorView message={error} /> : null}
      </View>
      {/* Filters */}
      <View style={styles.filterContainer} pointerEvents="box-none">
        <FlatList
        removeClippedSubviews={false}
          horizontal
          data={filters}
          keyExtractor={item => item.id}
          renderItem={({ item }) => renderFilter(item)}
          
          contentContainerStyle={styles.filterList}
        />
      </View>
      {/* Carousel for featured products */}
      {!loading && images.length > 0 && selectedFilter === 'featured' ? (
        <Carousel images={images} />
      ) : null}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        removeClippedSubviews={false}
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        keyboardShouldPersistTaps="handled"
        // Make FlatList fill available height so it can scroll on web
        style={styles.list}
        // Put header inside FlatList so it scrolls together on web
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    minHeight: '100vh',
    
  },
  columnWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
});

export default HomeScreen;
