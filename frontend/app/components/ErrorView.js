import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const ErrorView = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{message || 'An error occurred.'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.error,
    borderRadius: 8,
    margin: 8,
    alignItems: 'center',
  },
  text: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorView;
