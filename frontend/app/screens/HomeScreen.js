import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { testApiConnection } from '../api';

export default function HomeScreen() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestApi = async () => {
    setLoading(true);
    const res = await testApiConnection();
    setResult(res);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Store App</Text>
      <Button title={loading ? 'Testing...' : 'Test API Connection'} onPress={handleTestApi} disabled={loading} />
      {result && (
        <View style={styles.resultBox}>
          {result.success ? (
            <Text style={styles.success}>API Connected! Products: {Array.isArray(result.data) ? result.data.length : 0}</Text>
          ) : (
            <Text style={styles.error}>Error: {result.error}</Text>
          )}
        </View>
      )}
    </View>
  );
}

// StyleSheet is used for styles below
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  resultBox: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
});
