import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Alert, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../../api/admin.api';
import Loader from '../../components/Loader';
import ErrorView from '../../components/ErrorView';

const AdminProductsManagementScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pickedImage, setPickedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    platform: 'ios',
    sku: '',
    image: '',
  });

  const itemsPerPage = 10;

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSearch();
  }, [products, search, platformFilter]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetProducts();
      const data = res.data?.data || res.data?.products || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load products');
      console.error('Products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearch = () => {
    let filtered = products;

    // Search filter
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(p => p.platform === platformFilter);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      
      if (base64) {
        // Convert to base64 data URL
        const base64Image = `data:image/jpeg;base64,${base64}`;
        setPickedImage(imageUri);
        setFormData({ ...formData, image: base64Image });
      } else {
        // Fallback to URI
        setPickedImage(imageUri);
        setFormData({ ...formData, image: imageUri });
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setPickedImage(null);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      platform: product.platform,
      sku: product.sku || '',
      image: product.image || '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setPickedImage(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      platform: 'ios',
      sku: '',
      image: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      Alert.alert('Error', 'Name, price, and stock are required');
      return;
    }

    if (!editingProduct && !formData.image) {
      Alert.alert('Error', 'Image URL is required for new products');
      return;
    }

    try {
      if (editingProduct) {
        await adminUpdateProduct(editingProduct.id, formData);
      } else {
        await adminCreateProduct(formData);
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      Alert.alert('Error', 'Failed to save product');
      console.error('Save error:', err);
    }
  };

  const handleDelete = (product) => {
    console.log('handleDelete called for product:', product.id);
    setProductToDelete(product);
    setShowDeleteConfirm(true);
    Alert.alert('Confirmation', 'Modal will open. Confirm delete in the dialog.');
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    console.log('Delete confirmed, making API call for product:', productToDelete.id);
    setShowDeleteConfirm(false);
    setDeleting(true);
    try {
      const response = await adminDeleteProduct(productToDelete.id);
      console.log('Delete success:', response);
      setError('');
      setProductToDelete(null);
      Alert.alert('Success', 'Product deleted successfully');
      loadProducts();
    } catch (err) {
      console.error('Delete error full:', err);
      console.error('Delete error response:', err.response);
      console.error('Delete error message:', err.message);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
      setError('Failed to delete: ' + errorMsg);
      Alert.alert('Error', 'Failed to delete product:\n' + errorMsg);
      setProductToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    console.log('Delete cancelled');
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  if (loading) return <Loader />;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.header}>Products Management</Text>
        </View>

        {error ? <ErrorView message={error} /> : null}

        {/* Search and Filters */}
        <View style={styles.filterSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or SKU..."
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.platformFilters}>
            {['all', 'ios', 'android'].map(platform => (
              <TouchableOpacity
                key={platform}
                style={[
                  styles.filterButton,
                  platformFilter === platform && styles.filterButtonActive
                ]}
                onPress={() => setPlatformFilter(platform)}
              >
                <Text style={[
                  styles.filterButtonText,
                  platformFilter === platform && styles.filterButtonTextActive
                ]}>
                  {platform === 'all' ? 'All' : platform.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New Product</Text>
        </TouchableOpacity>

        {/* Products Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.nameCell]}>Name</Text>
            <Text style={[styles.tableCell, styles.priceCell]}>Price</Text>
            <Text style={[styles.tableCell, styles.stockCell]}>Stock</Text>
            <Text style={[styles.tableCell, styles.actionCell]}>Actions</Text>
          </View>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <View key={product.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.nameCell]} numberOfLines={2}>{product.name}</Text>
                <Text style={[styles.tableCell, styles.priceCell]}>${product.price}</Text>
                <Text style={[styles.tableCell, styles.stockCell]}>
                  <Text style={product.stock === 0 ? styles.outOfStock : styles.inStock}>
                    {product.stock}
                  </Text>
                </Text>
                <View style={[styles.tableCell, styles.actionCell, styles.actionButtons]}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleEdit(product)}
                    disabled={deleting}
                  >
                    <MaterialIcons name="edit" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.deleteBtn, deleting && styles.disabledBtn]}
                    onPress={() => {
                      console.log('Delete button pressed for product:', product.id, product.name);
                      handleDelete(product);
                    }}
                    disabled={deleting}
                  >
                    <MaterialIcons name="delete" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No products found</Text>
          )}
        </View>

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(currentPage - 1)}
              style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
            >
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.paginationInfo}>
              Page {currentPage} of {totalPages}
            </Text>
            <TouchableOpacity
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage(currentPage + 1)}
              style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
            >
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal for Add/Edit */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.formLabel}>Product Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter product name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.descriptionInput]}
                placeholder="Enter product description"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
              />

              <Text style={styles.formLabel}>Price *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter price"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="decimal-pad"
              />

              <Text style={styles.formLabel}>Stock *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter stock quantity"
                value={formData.stock}
                onChangeText={(text) => setFormData({ ...formData, stock: text })}
                keyboardType="number-pad"
              />

              <Text style={styles.formLabel}>SKU</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter SKU"
                value={formData.sku}
                onChangeText={(text) => setFormData({ ...formData, sku: text })}
              />

              <Text style={styles.formLabel}>Image {!editingProduct && '*'}</Text>
              <TouchableOpacity 
                style={styles.imagePickerButton}
                onPress={pickImage}
              >
                <MaterialIcons name="image" size={28} color="#1976D2" />
                <Text style={styles.imagePickerButtonText}>
                  {pickedImage || formData.image ? 'Change Image' : 'Pick Image'}
                </Text>
              </TouchableOpacity>

              {(pickedImage || formData.image) && (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: pickedImage || formData.image }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => {
                      setPickedImage(null);
                      setFormData({ ...formData, image: '' });
                    }}
                  >
                    <MaterialIcons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.formLabel}>Platform</Text>
              <View style={styles.platformButtons}>
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

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Delete Product</Text>
            <Text style={styles.confirmMessage}>
              Are you sure you want to delete "{productToDelete?.name}"?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelConfirmButton]}
                onPress={cancelDelete}
              >
                <Text style={styles.cancelConfirmButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.deleteConfirmButton]}
                onPress={() => {
                  console.log('Delete confirm button pressed for product:', productToDelete?.id);
                  confirmDelete();
                }}
                disabled={deleting}
              >
                <Text style={styles.deleteConfirmButtonText}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Text>
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
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSection: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  platformFilters: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#0D47A1',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 12,
    color: '#333',
  },
  nameCell: {
    flex: 2,
  },
  priceCell: {
    flex: 1,
    textAlign: 'center',
  },
  stockCell: {
    flex: 1,
    textAlign: 'center',
  },
  actionCell: {
    flex: 1.2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  inStock: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  outOfStock: {
    color: '#F44336',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#999',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1976D2',
    borderRadius: 4,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  paginationInfo: {
    fontWeight: '600',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: '#1976D2',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f9ff',
  },
  imagePickerButtonText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  imagePreviewContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4444',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  platformButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  platformButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  platformButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  platformButtonTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelConfirmButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelConfirmButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteConfirmButton: {
    backgroundColor: '#D32F2F',
  },
  deleteConfirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default AdminProductsManagementScreen;
