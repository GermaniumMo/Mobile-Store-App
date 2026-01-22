import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const QuantitySelector = ({ quantity, onChange }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={() => onChange(Math.max(1, quantity - 1))}>
      <Text style={styles.buttonText}>-</Text>
    </TouchableOpacity>
    <Text style={styles.quantity}>{quantity}</Text>
    <TouchableOpacity style={styles.button} onPress={() => onChange(quantity + 1)}>
      <Text style={styles.buttonText}>+</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
});

export default QuantitySelector;
