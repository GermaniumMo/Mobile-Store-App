import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getProductDetails(id);
        setProduct(res.data.product);
        const reviewsRes = await getProductReviews(id);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        setError('Failed to load product details');
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
      await addToCart({ product_id: id, quantity });
      navigation.navigate('Cart');
    } catch (err) {
      setCartError('Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorView message={error} />;
  if (!product) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Carousel images={product.images || [product.image]} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.desc}>{product.description}</Text>
      <QuantitySelector quantity={quantity} onChange={setQuantity} />
      <TouchableOpacity style={styles.button} onPress={handleAddToCart} disabled={cartLoading}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
      {cartError && <ErrorView message={cartError} />}
      <Text style={styles.section}>Reviews</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  price: {
    fontSize: 18,
    color: '#1976D2',
    marginVertical: 8,
  },
  desc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },
  noReviews: {
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  review: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  reviewUser: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reviewText: {
    fontSize: 15,
    marginBottom: 2,
  },
  reviewRating: {
    color: '#1976D2',
    fontSize: 14,
  },
});

export default ProductDetailsScreen;
