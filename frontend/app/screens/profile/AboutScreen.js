import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About Mobile Store</Text>
      <Text style={styles.description}>
        Welcome to Mobile Store, your ultimate destination for the latest mobile phones and accessories.
      </Text>
      <Text style={styles.sectionTitle}>Our Mission</Text>
      <Text style={styles.text}>
        We are committed to providing customers with high-quality mobile devices at competitive prices.
      </Text>
      <Text style={styles.sectionTitle}>Why Choose Us?</Text>
      <Text style={styles.text}>
        • Wide selection of iOS and Android phones
        • Competitive pricing
        • Fast shipping
        • Excellent customer support
        • Secure transactions
      </Text>
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.text}>
        Email: support@mobilestore.com{'\n'}
        Phone: 1-800-MOBILE-1{'\n'}
        Website: www.mobilestore.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1976D2',
  },
  text: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
});
