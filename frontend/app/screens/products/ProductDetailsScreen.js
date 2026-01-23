import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getProductDetails, getProductReviews } from '../../api/product.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';
import Carousel from '../../components/Carousel';
import QuantitySelector from '../../components/QuantitySelector';
import { addToCart } from '../../api/cart.api';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState('');

  // Setup navigation with custom back button
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: true,
      headerTintColor: '#1976D2',
      headerBackTitle: 'Back',
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1976D2" />
          <Text style={{ color: '#1976D2', marginLeft: 8, fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getProductDetails(id);
        // Handle both response formats
        const productData = res.data.data || res.data.product || res.data;
        setProduct(productData);
        
        // Build full image URLs if needed
        if (productData.gallery_images) {
          productData.gallery_images = productData.gallery_images.map(img => {
            if (img && !img.startsWith('http')) {
              return `http://127.0.0.1:8000/storage/${img}`;
            }
            return img;
          });
        }
        
        const reviewsRes = await getProductReviews(id);
        setReviews(reviewsRes.data.data || reviewsRes.data.reviews || []);
      } catch (err) {
        setError('Failed to load product details');
        console.error('Product details error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddToCart = async () => {
    setCartError('');
    setCartLoading(true);
    try {
      const res = await addToCart({ product_id: id, quantity });
      console.log('Added to cart:', res.data);
      // Show success message
      alert('Added to cart successfully!');
      // Navigate to cart after a short delay
      setTimeout(() => navigation.navigate('CartScreenMain'), 500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add to cart. Please login first.';
      console.error('Cart error:', err.response?.data || err.message);
      setCartError(errorMsg);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorView message={error} />;
  if (!product) return null;

  // Build full image URLs
  let imageUrl = product.primary_image || product.image;
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `http://127.0.0.1:8000/storage/${imageUrl}`;
  }

  const carouselImages = product.gallery_images || [imageUrl];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Carousel images={carouselImages} />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.brand}>
          {product.brand && product.brand.length > 0 ? product.brand[0] : 'N/A'}
        </Text>
        <Text style={styles.price}>${product.price}</Text>
        {product.discount_price && (
          <Text style={styles.originalPrice}>${product.discount_price}</Text>
        )}
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stock:</Text>
            <Text style={styles.infoValue}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rating:</Text>
            <Text style={styles.infoValue}>★ {product.rating || 0}</Text>
          </View>
        </View>

        <Text style={styles.section}>Description</Text>
        <Text style={styles.desc}>{product.description || 'No description available'}</Text>

        <Text style={styles.section}>Specifications</Text>
        <View style={styles.specContainer}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Platform:</Text>
            <Text style={styles.specValue}>{product.platform || 'N/A'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>SKU:</Text>
            <Text style={styles.specValue}>{product.sku || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.section}>Reviews ({reviews.length})</Text>
        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>No reviews yet.</Text>
        ) : (
          reviews.map((r, idx) => (
            <View key={idx} style={styles.review}>
              <Text style={styles.reviewUser}>{r.user?.name || 'User'}</Text>
              <Text style={styles.reviewText}>{r.comment}</Text>
              <Text style={styles.reviewRating}>Rating: {r.rating}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.actionContainer}>
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
        <TouchableOpacity 
          style={[styles.button, cartLoading && styles.buttonDisabled]} 
          onPress={handleAddToCart} 
          disabled={cartLoading}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.homeButton]} 
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
        {cartError && <ErrorView message={cartError} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#222',
  },
  brand: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#1976D2',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 12,
  },
  infoContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#222',
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 12,
    color: '#222',
  },
  desc: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 12,
  },
  specContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  specValue: {
    fontSize: 14,
    color: '#222',
  },
  noReviews: {
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  review: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  reviewUser: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  reviewText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    lineHeight: 20,
  },
  reviewRating: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: '600',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  homeButton: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ProductDetailsScreen;
