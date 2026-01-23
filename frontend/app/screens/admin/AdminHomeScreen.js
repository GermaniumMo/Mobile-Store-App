import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { adminGetProducts, adminGetOrders } from '../../api/admin.api';
import { getOrders } from '../../api/order.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const AdminHomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const productsRes = await adminGetProducts();
        const ordersRes = await adminGetOrders();
        
        const productData = productsRes.data.data || productsRes.data.products || [];
        const orderData = ordersRes.data.data || ordersRes.data.orders || [];
        
        setProducts(Array.isArray(productData) ? productData : []);
        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (err) {
        setError('Failed to load admin data');
        console.error('Admin error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order?.total || 0), 0);
  const lowStockProducts = products.filter(p => p.stock < 5).length;

  // Get latest 10 products for table
  const latestProducts = products.slice(0, 10);

  // Filter products
  let filteredProducts = latestProducts;
  if (filter === 'low-stock') {
    filteredProducts = latestProducts.filter(p => p.stock < 5);
  } else if (filter === 'featured') {
    filteredProducts = latestProducts.filter(p => p.is_featured);
  }

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Admin Dashboard</Text>
        {error && <ErrorView message={error} />}

        {/* Metrics Cards */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <MaterialIcons name="inventory-2" size={32} color="#1976D2" />
            <Text style={styles.metricValue}>{totalProducts}</Text>
            <Text style={styles.metricLabel}>Products</Text>
          </View>
          <View style={styles.metricCard}>
            <MaterialIcons name="receipt" size={32} color="#4CAF50" />
            <Text style={styles.metricValue}>{totalOrders}</Text>
            <Text style={styles.metricLabel}>Orders</Text>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <MaterialIcons name="attach-money" size={32} color="#FF9800" />
            <Text style={styles.metricValue}>${totalRevenue.toFixed(0)}</Text>
            <Text style={styles.metricLabel}>Revenue</Text>
          </View>
          <View style={styles.metricCard}>
            <MaterialIcons name="warning" size={32} color="#F44336" />
            <Text style={styles.metricValue}>{lowStockProducts}</Text>
            <Text style={styles.metricLabel}>Low Stock</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('AdminProducts')}
            >
              <MaterialIcons name="add" size={28} color="#fff" />
              <Text style={styles.actionButtonText}>Products</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('AdminOrders')}
            >
              <MaterialIcons name="shopping-bag" size={28} color="#fff" />
              <Text style={styles.actionButtonText}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('AdminUsers')}
            >
              <MaterialIcons name="people" size={28} color="#fff" />
              <Text style={styles.actionButtonText}>Users</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Latest Products</Text>
          <View style={styles.filterButtons}>
            {[
              { id: 'all', label: 'All' },
              { id: 'featured', label: 'Featured' },
              { id: 'low-stock', label: 'Low Stock' },
            ].map(f => (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.filterButton,
                  filter === f.id && styles.filterButtonActive
                ]}
                onPress={() => setFilter(f.id)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === f.id && styles.filterButtonTextActive
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Products Table */}
        {filteredProducts.length > 0 ? (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.productNameCell]}>Product</Text>
              <Text style={styles.tableCell}>Stock</Text>
              <Text style={styles.tableCell}>Price</Text>
            </View>
            {filteredProducts.map(product => (
              <View key={product.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.productNameCell]} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.tableCell}>{product.stock}</Text>
                <Text style={styles.tableCell}>${Number(product.price || 0).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  metricsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1976D2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 8,
  },
  filtersSection: {
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#222',
  },
  productNameCell: {
    flex: 2,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default AdminHomeScreen;
