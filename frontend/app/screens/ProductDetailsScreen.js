import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProductDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Details</Text>
      <Text>Product details will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
});
