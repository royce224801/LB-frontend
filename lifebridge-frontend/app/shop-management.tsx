import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Switch,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Medicine {
  id?: number;
  name: string;
  genericName: string;
  manufacturer: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: string;
  expiryDate: string;
  prescriptionRequired: string;
  imageUrl: string;
  isActive: boolean;
}

interface ShopOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  orderDateTime: string;
  items: Array<{
    medicineName: string;
    quantity: number;
    unitPrice: number;
  }>;
}

type TabType = 'medicines' | 'orders' | 'analytics';

export default function MedicalShopManagementScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('medicines');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    name: '',
    genericName: '',
    manufacturer: '',
    description: '',
    category: '',
    price: 0,
    stockQuantity: 0,
    unit: '',
    expiryDate: '',
    prescriptionRequired: 'NO',
    imageUrl: '',
    isActive: true
  });

  const categories = ['Pain Relief', 'Antibiotics', 'Vitamins', 'Cold & Flu', 'Diabetes', 'Heart', 'Skin Care'];

  useEffect(() => {
    fetchMedicines();
    fetchOrders();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/api/medicines/shop/1', {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': 'admin@lifebridge.com'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
        console.log('Fetched', data.length, 'medicines from API');
      } else {
        console.error('Failed to fetch medicines:', response.status, response.statusText);
        setMedicines([]);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      console.log('Loading mock medicines data as fallback');
      loadMockMedicines();
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/api/orders/shop', {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': 'admin@lifebridge.com'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        console.log('Fetched', data.length, 'orders from API');
      } else {
        console.error('Failed to fetch orders:', response.status, response.statusText);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.log('Loading mock orders data as fallback');
      loadMockOrders();
    }
  };

  const loadMockMedicines = () => {
    const mockMedicines: Medicine[] = [
      {
        id: 1,
        name: 'Paracetamol 500mg',
        genericName: 'Paracetamol',
        manufacturer: 'ABC Pharma',
        description: 'Pain reliever and fever reducer',
        category: 'Pain Relief',
        price: 50,
        stockQuantity: 100,
        unit: 'Tablets',
        expiryDate: '2025-12-31',
        prescriptionRequired: 'No',
        imageUrl: '',
        isActive: true
      },
      {
        id: 2,
        name: 'Vitamin D3 Capsules',
        genericName: 'Cholecalciferol',
        manufacturer: 'Health Plus',
        description: 'Vitamin D3 supplement',
        category: 'Vitamins',
        price: 150,
        stockQuantity: 50,
        unit: 'Capsules',
        expiryDate: '2025-08-15',
        prescriptionRequired: 'No',
        imageUrl: '',
        isActive: true
      },
      {
        id: 3,
        name: 'Cough Syrup',
        genericName: 'Dextromethorphan',
        manufacturer: 'MediCare',
        description: 'Cough suppressant syrup',
        category: 'Respiratory',
        price: 120,
        stockQuantity: 30,
        unit: 'Bottles',
        expiryDate: '2025-06-20',
        prescriptionRequired: 'No',
        imageUrl: '',
        isActive: true
      }
    ];
    setMedicines(mockMedicines);
  };

  const loadMockOrders = () => {
    const mockOrders: ShopOrder[] = [
      {
        id: 1,
        orderNumber: 'ORD-2024-001',
        customerName: 'John Doe',
        customerPhone: '+91 9876543210',
        totalAmount: 250.00,
        status: 'PENDING',
        paymentStatus: 'PAID',
        orderDateTime: '2024-01-15T10:30:00',
        items: [
          { medicineName: 'Paracetamol 500mg', quantity: 2, unitPrice: 50 },
          { medicineName: 'Vitamin D3', quantity: 1, unitPrice: 150 }
        ]
      },
      {
        id: 2,
        orderNumber: 'ORD-2024-002',
        customerName: 'Jane Smith',
        customerPhone: '+91 8765432109',
        totalAmount: 180.00,
        status: 'OUT_FOR_DELIVERY',
        paymentStatus: 'PENDING',
        orderDateTime: '2024-01-15T09:15:00',
        items: [
          { medicineName: 'Cough Syrup', quantity: 1, unitPrice: 120 },
          { medicineName: 'Band-Aid Pack', quantity: 3, unitPrice: 20 }
        ]
      }
    ];
    setOrders(mockOrders);
  };

  const saveMedicine = async () => {
    if (!newMedicine.name || !newMedicine.price || !newMedicine.stockQuantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const url = editingMedicine 
        ? `http://10.0.2.2:8080/api/medicines/${editingMedicine.id}`
        : 'http://10.0.2.2:8080/api/medicines';
      
      const method = editingMedicine ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': 'admin@lifebridge.com'
        },
        body: JSON.stringify(newMedicine)
      });

      if (response.ok) {
        Alert.alert('Success', `Medicine ${editingMedicine ? 'updated' : 'added'} successfully`);
        fetchMedicines();
        resetMedicineForm();
      } else {
        Alert.alert('Error', 'Failed to save medicine');
      }
    } catch (error) {
      console.error('Error saving medicine:', error);
      Alert.alert('Error', 'Failed to save medicine');
    }
  };

  const deleteMedicine = async (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this medicine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://10.0.2.2:8080/api/medicines/${id}`, {
                method: 'DELETE',
                headers: {
                  'X-User-Email': 'admin@lifebridge.com'
                }
              });

              if (response.ok) {
                Alert.alert('Success', 'Medicine deleted successfully');
                fetchMedicines();
              } else {
                Alert.alert('Error', 'Failed to delete medicine');
              }
            } catch (error) {
              console.error('Error deleting medicine:', error);
              Alert.alert('Error', 'Failed to delete medicine');
            }
          }
        }
      ]
    );
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'X-User-Email': 'admin@lifebridge.com'
        }
      });

      if (response.ok) {
        Alert.alert('Success', 'Order status updated successfully');
        fetchOrders();
      } else {
        Alert.alert('Error', 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const resetMedicineForm = () => {
    setNewMedicine({
      name: '',
      genericName: '',
      manufacturer: '',
      description: '',
      category: '',
      price: 0,
      stockQuantity: 0,
      unit: '',
      expiryDate: '',
      prescriptionRequired: 'NO',
      imageUrl: '',
      isActive: true
    });
    setEditingMedicine(null);
    setShowAddMedicine(false);
  };

  const startEditMedicine = (medicine: Medicine) => {
    setNewMedicine({ ...medicine });
    setEditingMedicine(medicine);
    setShowAddMedicine(true);
  };

  const renderMedicine = ({ item }: { item: Medicine }) => (
    <View style={styles.medicineCard}>
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/60' }} 
        style={styles.medicineImage} 
      />
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.genericName}>{item.genericName}</Text>
        <Text style={styles.manufacturer}>{item.manufacturer}</Text>
        <View style={styles.medicineStats}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={[
            styles.stock,
            { color: item.stockQuantity > 10 ? '#34C759' : item.stockQuantity > 0 ? '#FF9500' : '#FF3B30' }
          ]}>
            Stock: {item.stockQuantity}
          </Text>
        </View>
      </View>
      <View style={styles.medicineActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => startEditMedicine(item)}
        >
          <Ionicons name="create-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => item.id && deleteMedicine(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrder = ({ item }: { item: ShopOrder }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.customerInfo}>{item.customerName} • {item.customerPhone}</Text>
      <Text style={styles.orderDate}>{new Date(item.orderDateTime).toLocaleDateString()}</Text>
      
      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.orderItem}>
            {orderItem.quantity}x {orderItem.medicineName}
          </Text>
        ))}
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>₹{item.totalAmount}</Text>
        <View style={styles.orderActions}>
          {item.status === 'PENDING' && (
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#007AFF' }]}
              onPress={() => updateOrderStatus(item.id, 'CONFIRMED')}
            >
              <Text style={styles.statusButtonText}>Confirm</Text>
            </TouchableOpacity>
          )}
          {item.status === 'CONFIRMED' && (
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#5856D6' }]}
              onPress={() => updateOrderStatus(item.id, 'PREPARING')}
            >
              <Text style={styles.statusButtonText}>Preparing</Text>
            </TouchableOpacity>
          )}
          {item.status === 'PREPARING' && (
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#FF6B35' }]}
              onPress={() => updateOrderStatus(item.id, 'OUT_FOR_DELIVERY')}
            >
              <Text style={styles.statusButtonText}>Out for Delivery</Text>
            </TouchableOpacity>
          )}
          {item.status === 'OUT_FOR_DELIVERY' && (
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#34C759' }]}
              onPress={() => updateOrderStatus(item.id, 'DELIVERED')}
            >
              <Text style={styles.statusButtonText}>Delivered</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#FF9500';
      case 'CONFIRMED': return '#007AFF';
      case 'PREPARING': return '#5856D6';
      case 'OUT_FOR_DELIVERY': return '#FF6B35';
      case 'DELIVERED': return '#34C759';
      case 'CANCELLED': return '#FF3B30';
      default: return '#666';
    }
  };

  const renderMedicineForm = () => (
    <Modal visible={showAddMedicine} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={resetMedicineForm}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {editingMedicine ? 'Edit Medicine' : 'Add Medicine'}
          </Text>
          <TouchableOpacity onPress={saveMedicine}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Medicine Name *</Text>
            <TextInput
              style={styles.formInput}
              value={newMedicine.name}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, name: text })}
              placeholder="Enter medicine name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Generic Name</Text>
            <TextInput
              style={styles.formInput}
              value={newMedicine.genericName}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, genericName: text })}
              placeholder="Enter generic name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Manufacturer</Text>
            <TextInput
              style={styles.formInput}
              value={newMedicine.manufacturer}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, manufacturer: text })}
              placeholder="Enter manufacturer name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    newMedicine.category === category && styles.selectedCategoryChip
                  ]}
                  onPress={() => setNewMedicine({ ...newMedicine, category })}
                >
                  <Text style={[
                    styles.categoryChipText,
                    newMedicine.category === category && styles.selectedCategoryChipText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Price (₹) *</Text>
              <TextInput
                style={styles.formInput}
                value={newMedicine.price?.toString() || ''}
                onChangeText={(text) => setNewMedicine({ ...newMedicine, price: parseFloat(text) || 0 })}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Unit</Text>
              <TextInput
                style={styles.formInput}
                value={newMedicine.unit}
                onChangeText={(text) => setNewMedicine({ ...newMedicine, unit: text })}
                placeholder="tablet, ml, gm"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Stock Quantity *</Text>
            <TextInput
              style={styles.formInput}
              value={newMedicine.stockQuantity?.toString() || ''}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, stockQuantity: parseInt(text) || 0 })}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Expiry Date</Text>
            <TextInput
              style={styles.formInput}
              value={newMedicine.expiryDate}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, expiryDate: text })}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={newMedicine.description}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, description: text })}
              placeholder="Enter medicine description"
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Image URL</Text>
            <TextInput
              style={styles.formInput}
              value={newMedicine.imageUrl}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, imageUrl: text })}
              placeholder="https://example.com/image.jpg"
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>Prescription Required</Text>
            <Switch
              value={newMedicine.prescriptionRequired === 'YES'}
              onValueChange={(value) => 
                setNewMedicine({ ...newMedicine, prescriptionRequired: value ? 'YES' : 'NO' })
              }
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={newMedicine.prescriptionRequired === 'YES' ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>Active</Text>
            <Switch
              value={newMedicine.isActive}
              onValueChange={(value) => setNewMedicine({ ...newMedicine, isActive: value })}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={newMedicine.isActive ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop Management</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'medicines' && styles.activeTab]}
          onPress={() => setActiveTab('medicines')}
        >
          <Ionicons 
            name="medical-outline" 
            size={20} 
            color={activeTab === 'medicines' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'medicines' && styles.activeTabText]}>
            Medicines
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Ionicons 
            name="receipt-outline" 
            size={20} 
            color={activeTab === 'orders' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => setActiveTab('analytics')}
        >
          <Ionicons 
            name="analytics-outline" 
            size={20} 
            color={activeTab === 'analytics' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'medicines' && (
          <View style={styles.medicinesTab}>
            <View style={styles.medicinesHeader}>
              <Text style={styles.sectionTitle}>Medicines ({medicines.length})</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddMedicine(true)}
              >
                <Ionicons name="add" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Add Medicine</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={medicines}
              renderItem={renderMedicine}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              contentContainerStyle={styles.medicinesList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {activeTab === 'orders' && (
          <View style={styles.ordersTab}>
            <Text style={styles.sectionTitle}>Orders ({orders.length})</Text>
            <FlatList
              data={orders}
              renderItem={renderOrder}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.ordersList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {activeTab === 'analytics' && (
          <View style={styles.analyticsTab}>
            <Text style={styles.sectionTitle}>Analytics</Text>
            <Text style={styles.comingSoon}>Analytics dashboard coming soon...</Text>
          </View>
        )}
      </View>

      {renderMedicineForm()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  medicinesTab: {
    flex: 1,
  },
  medicinesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  medicinesList: {
    paddingHorizontal: 16,
  },
  medicineCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medicineImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  medicineInfo: {
    flex: 1,
    marginLeft: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  genericName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  manufacturer: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  medicineStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  stock: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 12,
  },
  medicineActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  ordersTab: {
    flex: 1,
    padding: 16,
  },
  ordersList: {
    paddingTop: 12,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  customerInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  orderItems: {
    marginBottom: 8,
  },
  orderItem: {
    fontSize: 12,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  orderActions: {
    flexDirection: 'row',
  },
  statusButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 4,
  },
  statusButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  analyticsTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categorySelector: {
    marginTop: 4,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryChipText: {
    color: '#FFF',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#000',
  },
});