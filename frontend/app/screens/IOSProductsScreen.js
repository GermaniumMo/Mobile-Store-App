import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function IOSProductsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>iOS Products</Text>
      <Text>List of iOS products will appear here.</Text>
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
    color: '#007AFF',
  },
});
