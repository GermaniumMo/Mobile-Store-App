import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Mobile Store App</Text>
      <Text style={styles.text}>This app lets you browse iOS and Android phones, view details, and learn React Native + Laravel API best practices. Built for beginners!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#007AFF',
  },
  text: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
  },
});
