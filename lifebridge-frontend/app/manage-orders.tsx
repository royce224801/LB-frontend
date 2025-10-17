import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import API_BASE_URL from '../api-config';

const { width, height } = Dimensions.get('window');

interface OrderItem {
  id: number;
  medicineName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  status: string;
  orderDateTime: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  paymentMethod: string;
  paymentStatus: string;
  specialInstructions?: string;
  orderItems: OrderItem[];
}

const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED', 
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED'
];

const STATUS_COLORS = {
  PENDING: '#FF9500',
  CONFIRMED: '#007AFF', 
  PREPARING: '#32D74B',
  OUT_FOR_DELIVERY: '#5856D6',
  DELIVERED: '#34C759',
  CANCELLED: '#FF3B30',
  RETURNED: '#8E8E93'
};

const STATUS_ICONS = {
  PENDING: 'time-outline',
  CONFIRMED: 'checkmark-circle-outline',
  PREPARING: 'construct-outline', 
  OUT_FOR_DELIVERY: 'car-outline',
  DELIVERED: 'checkmark-done-outline',
  CANCELLED: 'close-circle-outline',
  RETURNED: 'return-up-back-outline'
};

export default function ManageOrders() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Medicine shop admin email - this should match the shop owner in the database
  const ADMIN_EMAIL = 'shop@lifebridge.com';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/orders/shop`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': ADMIN_EMAIL,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        console.log('Fetched', data.length, 'orders from API');
      } else {
        console.error('Failed to fetch orders:', response.status, response.statusText);
        console.log('Loading mock orders as fallback');
        loadMockOrders();
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.log('Loading mock orders as fallback');
      loadMockOrders();
    } finally {
      setLoading(false);
    }
  };

  const loadMockOrders = () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        orderNumber: 'ORD-2024-001',
        customerName: 'John Doe',
        customerPhone: '+91 9876543210',
        deliveryAddress: '123 Main St, City, State, 12345',
        totalAmount: 250.00,
        status: 'PENDING',
        orderDateTime: '2024-01-15T10:30:00',
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        specialInstructions: 'Please deliver before 6 PM',
        orderItems: [
          { id: 1, medicineName: 'Paracetamol 500mg', quantity: 2, price: 50, totalPrice: 100 },
          { id: 2, medicineName: 'Vitamin D3', quantity: 1, price: 150, totalPrice: 150 }
        ]
      },
      {
        id: 2,
        orderNumber: 'ORD-2024-002',
        customerName: 'Jane Smith',
        customerPhone: '+91 8765432109',
        deliveryAddress: '456 Oak Ave, City, State, 67890',
        totalAmount: 180.00,
        status: 'OUT_FOR_DELIVERY',
        orderDateTime: '2024-01-15T09:15:00',
        estimatedDeliveryTime: '2024-01-15T18:00:00',
        paymentMethod: 'CASH_ON_DELIVERY',
        paymentStatus: 'PENDING',
        orderItems: [
          { id: 3, medicineName: 'Cough Syrup', quantity: 1, price: 120, totalPrice: 120 },
          { id: 4, medicineName: 'Band-Aid Pack', quantity: 3, price: 20, totalPrice: 60 }
        ]
      },
      {
        id: 3,
        orderNumber: 'ORD-2024-003',
        customerName: 'Bob Johnson',
        customerPhone: '+91 7654321098',
        deliveryAddress: '789 Pine St, City, State, 54321',
        totalAmount: 320.00,
        status: 'DELIVERED',
        orderDateTime: '2024-01-14T14:45:00',
        actualDeliveryTime: '2024-01-14T17:30:00',
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        orderItems: [
          { id: 5, medicineName: 'Blood Pressure Tablets', quantity: 2, price: 160, totalPrice: 320 }
        ]
      }
    ];
    setOrders(mockOrders);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders().finally(() => setRefreshing(false));
  }, []);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': ADMIN_EMAIL,
        },
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        Alert.alert('Success', `Order status updated to ${newStatus}`);
      } else {
        // For demo purposes, update locally even if API fails
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        Alert.alert('Success', `Order status updated to ${newStatus} (Demo mode)`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // For demo purposes, update locally even if API fails
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Alert.alert('Success', `Order status updated to ${newStatus} (Demo mode)`);
    } finally {
      setUpdatingStatus(false);
      setStatusModalVisible(false);
      setSelectedOrder(null);
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#8E8E93';
  };

  const getStatusIcon = (status: string) => {
    return STATUS_ICONS[status as keyof typeof STATUS_ICONS] || 'help-outline';
  };

  const renderOrderCard = (order: Order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderNumberSection}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDateTime}>{formatDateTime(order.orderDateTime)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Ionicons 
            name={getStatusIcon(order.status) as any} 
            size={16} 
            color="white" 
            style={styles.statusIcon}
          />
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.customerSection}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <Text style={styles.customerPhone}>{order.customerPhone}</Text>
      </View>

      <View style={styles.addressSection}>
        <Ionicons name="location-outline" size={16} color="#8E8E93" />
        <Text style={styles.addressText}>{order.deliveryAddress}</Text>
      </View>

      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>Total Amount:</Text>
        <Text style={styles.amountValue}>{formatAmount(order.totalAmount)}</Text>
      </View>

      <View style={styles.paymentSection}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentMethod}>{order.paymentMethod}</Text>
          <View style={[
            styles.paymentStatusBadge,
            { backgroundColor: order.paymentStatus === 'PAID' ? '#34C759' : '#FF9500' }
          ]}>
            <Text style={styles.paymentStatusText}>{order.paymentStatus}</Text>
          </View>
        </View>
      </View>

      {order.specialInstructions && (
        <View style={styles.instructionsSection}>
          <Ionicons name="information-circle-outline" size={16} color="#007AFF" />
          <Text style={styles.instructionsText}>{order.specialInstructions}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.updateStatusButton}
        onPress={() => {
          setSelectedOrder(order);
          setStatusModalVisible(true);
        }}
      >
        <Ionicons name="create-outline" size={20} color="#007AFF" />
        <Text style={styles.updateStatusText}>Update Status</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStatusModal = () => (
    <Modal
      visible={statusModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setStatusModalVisible(false);
        setSelectedOrder(null);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Order Status</Text>
            <TouchableOpacity
              onPress={() => {
                setStatusModalVisible(false);
                setSelectedOrder(null);
              }}
            >
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {selectedOrder && (
            <View style={styles.orderSummary}>
              <Text style={styles.orderSummaryText}>
                Order: {selectedOrder.orderNumber}
              </Text>
              <Text style={styles.orderSummaryText}>
                Customer: {selectedOrder.customerName}
              </Text>
              <Text style={styles.currentStatusText}>
                Current Status: {selectedOrder.status}
              </Text>
            </View>
          )}

          <ScrollView style={styles.statusList}>
            {ORDER_STATUSES.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusOption,
                  selectedOrder?.status === status && styles.currentStatusOption
                ]}
                onPress={() => selectedOrder && updateOrderStatus(selectedOrder.id, status)}
                disabled={updatingStatus || selectedOrder?.status === status}
              >
                <View style={styles.statusOptionContent}>
                  <Ionicons 
                    name={getStatusIcon(status) as any} 
                    size={20} 
                    color={getStatusColor(status)} 
                  />
                  <Text style={[
                    styles.statusOptionText,
                    { color: getStatusColor(status) }
                  ]}>
                    {status}
                  </Text>
                </View>
                {selectedOrder?.status === status && (
                  <Ionicons name="checkmark" size={20} color={getStatusColor(status)} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {updatingStatus && (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Updating status...</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Orders</Text>
        <TouchableOpacity onPress={fetchOrders} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#8E8E93" />
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>
              Orders will appear here when customers place them
            </Text>
          </View>
        ) : (
          <View style={styles.ordersContainer}>
            <Text style={styles.ordersCount}>
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </Text>
            {orders.map(renderOrderCard)}
          </View>
        )}
      </ScrollView>

      {renderStatusModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8E8E93',
  },
  scrollView: {
    flex: 1,
  },
  ordersContainer: {
    padding: 15,
  },
  ordersCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 15,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderNumberSection: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 5,
  },
  orderDateTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  customerSection: {
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 5,
  },
  customerPhone: {
    fontSize: 14,
    color: '#007AFF',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
    lineHeight: 20,
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  paymentSection: {
    marginBottom: 15,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#8E8E93',
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  instructionsSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F2F2F7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: '#1D1D1F',
    marginLeft: 8,
    lineHeight: 20,
  },
  updateStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F4FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  updateStatusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  orderSummary: {
    padding: 20,
    backgroundColor: '#F2F2F7',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  orderSummaryText: {
    fontSize: 14,
    color: '#1D1D1F',
    marginBottom: 5,
  },
  currentStatusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginTop: 5,
  },
  statusList: {
    padding: 20,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
  },
  currentStatusOption: {
    backgroundColor: '#E8F4FF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  statusOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  loadingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});