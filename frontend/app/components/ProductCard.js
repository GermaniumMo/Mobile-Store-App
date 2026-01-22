import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ product, onPress }) => {
  const displayPrice = product.discount_price || product.price;
  const originalPrice = product.price;
  
  // Build full image URL if needed
  let imageUri = product.primary_image || product.image;
  if (imageUri && !imageUri.startsWith('http')) {
    imageUri = `http://127.0.0.1:8000/storage/${imageUri}`;
  }
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        onError={(e) => console.log('Image error:', e.nativeEvent.error)}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.brand}>
          {product.brand && product.brand[0] ? product.brand[0] : 'N/A'}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${displayPrice.toFixed(2)}</Text>
          {product.discount_price && (
            <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
          )}
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {product.rating || 0}</Text>
          <Text style={styles.stock}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  stock: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default ProductCard;
