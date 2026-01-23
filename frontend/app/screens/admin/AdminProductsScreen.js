import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../../api/admin.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const AdminProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    discount_price: '',
    description: '',
    platform: 'ios',
    stock: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetProducts();
      setProducts(res.data.data || res.data.products || []);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    Alert.alert('Delete Product', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await adminDeleteProduct(id);
          fetchProducts();
        } catch {
          setError('Failed to delete product');
        }
      }}
    ]);
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price.toString(),
        discount_price: (product.discount_price || '').toString(),
        description: product.description || '',
        platform: product.platform || 'ios',
        stock: product.stock.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        price: '',
        discount_price: '',
        description: '',
        platform: 'ios',
        stock: '',
      });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      Alert.alert('Error', 'Name, price, and stock are required');
      return;
    }
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock: parseInt(formData.stock),
      };
      if (editingProduct) {
        await adminUpdateProduct(editingProduct.id, data);
      } else {
        await adminCreateProduct(data);
      }
      setModalVisible(false);
      fetchProducts();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Manage Products</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      {loading && <Loader />}
      {error && <ErrorView message={error} />}
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sku}>SKU: {item.sku}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.stock}>Stock: {item.stock}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.edit} onPress={() => openModal(item)}>
                <Text style={{ color: '#fff' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delete} onPress={() => handleDelete(item.id)}>
                <Text style={{ color: '#fff' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {/* Modal for create/edit */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingProduct ? 'Edit Product' : 'Add New Product'}</Text>
            <ScrollView style={styles.formScroll}>
              <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="SKU"
                value={formData.sku}
                onChangeText={(text) => setFormData({ ...formData, sku: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="decimal-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Discount Price (optional)"
                value={formData.discount_price}
                onChangeText={(text) => setFormData({ ...formData, discount_price: text })}
                keyboardType="decimal-pad"
              />
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Description"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Stock"
                value={formData.stock}
                onChangeText={(text) => setFormData({ ...formData, stock: text })}
                keyboardType="number-pad"
              />
              <View style={styles.platformContainer}>
                <Text style={styles.platformLabel}>Platform:</Text>
                {['ios', 'android'].map(platform => (
                  <TouchableOpacity
                    key={platform}
                    style={[
                      styles.platformButton,
                      formData.platform === platform && styles.platformButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, platform })}
                  >
                    <Text style={[
                      styles.platformButtonText,
                      formData.platform === platform && styles.platformButtonTextActive
                    ]}>
                      {platform.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 8,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sku: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    color: '#1976D2',
    marginVertical: 4,
    fontWeight: '600',
  },
  stock: {
    fontSize: 13,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  edit: {
    backgroundColor: '#1976D2',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: '#D32F2F',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formScroll: {
    marginBottom: 16,
    maxHeight: '70%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  platformContainer: {
    marginBottom: 16,
  },
  platformLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  platformButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  platformButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  platformButtonText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  platformButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AdminProductsScreen;
