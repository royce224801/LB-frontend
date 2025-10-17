import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface OrderItem {
  medicineName: string;
  genericName: string;
  manufacturer: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

interface TrackingHistory {
  status: string;
  description: string;
  location: string;
  timestamp: string;
}

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  deliveryCharges: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryAddress: string;
  customerPhone: string;
  specialInstructions?: string;
  orderDateTime: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  items: OrderItem[];
  trackingHistory: TrackingHistory[];
}

export default function OrderTrackingScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Refresh orders when screen comes into focus (e.g., after placing an order)
  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Load orders from AsyncStorage
      const storedOrders = await AsyncStorage.getItem('lifebridge_orders');
      let orders: Order[] = [];
      
      if (storedOrders) {
        orders = JSON.parse(storedOrders);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(orders);
      if (orders.length > 0 && !selectedOrder) {
        setSelectedOrder(orders[0]);
      }
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Utility function to save orders to AsyncStorage
  const saveOrderToStorage = async (newOrder: Order) => {
    try {
      const storedOrders = await AsyncStorage.getItem('lifebridge_orders');
      let orders: Order[] = [];
      
      if (storedOrders) {
        orders = JSON.parse(storedOrders);
      }
      
      // Add new order at the beginning (most recent first)
      orders.unshift(newOrder);
      
      await AsyncStorage.setItem('lifebridge_orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  // For testing purposes - clear all orders
  const clearAllOrders = async () => {
    Alert.alert(
      'Clear All Orders',
      'Are you sure you want to clear all orders? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('lifebridge_orders');
              setOrders([]);
              setSelectedOrder(null);
              Alert.alert('Success', 'All orders cleared');
            } catch (error) {
              console.error('Error clearing orders:', error);
              Alert.alert('Error', 'Failed to clear orders');
            }
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#FF9500';
      case 'confirmed': return '#007AFF';
      case 'preparing': return '#5856D6';
      case 'out_for_delivery': return '#FF6B35';
      case 'delivered': return '#34C759';
      case 'cancelled': return '#FF3B30';
      case 'returned': return '#8E8E93';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'time-outline';
      case 'confirmed': return 'checkmark-circle-outline';
      case 'preparing': return 'construct-outline';
      case 'out_for_delivery': return 'bicycle-outline';
      case 'delivered': return 'checkmark-circle';
      case 'cancelled': return 'close-circle-outline';
      case 'returned': return 'return-down-back-outline';
      default: return 'help-circle-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOrderStatusProgress = (status: string) => {
    const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = statuses.indexOf(status.toLowerCase());
    return currentIndex >= 0 ? ((currentIndex + 1) / statuses.length) * 100 : 0;
  };

  const renderOrderCard = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[
        styles.orderCard,
        selectedOrder?.id === item.id && styles.selectedOrderCard
      ]}
      onPress={() => setSelectedOrder(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <Text style={styles.orderDate}>{formatDate(item.orderDateTime)}</Text>
      <Text style={styles.orderShop}>{item.shopName}</Text>
      <Text style={styles.orderTotal}>₹{item.finalAmount}</Text>
    </TouchableOpacity>
  );

  const renderTrackingStep = ({ item, index }: { item: TrackingHistory; index: number }) => {
    const isLatest = index === 0;
    return (
      <View style={styles.trackingStep}>
        <View style={styles.trackingLine}>
          <View style={[styles.trackingDot, isLatest && styles.activeTrackingDot]} />
          {index < (selectedOrder?.trackingHistory.length || 0) - 1 && (
            <View style={styles.trackingConnector} />
          )}
        </View>
        <View style={styles.trackingContent}>
          <View style={styles.trackingHeader}>
            <Text style={[styles.trackingStatus, isLatest && styles.activeTrackingStatus]}>
              {item.status.replace('_', ' ')}
            </Text>
            <Text style={styles.trackingTime}>{formatDate(item.timestamp)}</Text>
          </View>
          <Text style={styles.trackingDescription}>{item.description}</Text>
          {item.location && (
            <Text style={styles.trackingLocation}>📍 {item.location}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <ScrollView
        style={styles.orderDetails}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Order Status Progress */}
        <View style={styles.section}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${getOrderStatusProgress(selectedOrder.status)}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Order {selectedOrder.status.replace('_', ' ').toLowerCase()}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <Ionicons
              name={getStatusIcon(selectedOrder.status) as any}
              size={24}
              color={getStatusColor(selectedOrder.status)}
            />
            <Text style={[styles.currentStatus, { color: getStatusColor(selectedOrder.status) }]}>
              {selectedOrder.status.replace('_', ' ')}
            </Text>
          </View>

          {selectedOrder.estimatedDeliveryTime && (
            <View style={styles.deliveryTime}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.deliveryTimeText}>
                Estimated delivery: {formatDate(selectedOrder.estimatedDeliveryTime)}
              </Text>
            </View>
          )}
        </View>

        {/* Shop Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Shop</Text>
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{selectedOrder.shopName}</Text>
            <Text style={styles.shopAddress}>{selectedOrder.shopAddress}</Text>
            <TouchableOpacity style={styles.shopPhone}>
              <Ionicons name="call-outline" size={16} color="#007AFF" />
              <Text style={styles.shopPhoneText}>{selectedOrder.shopPhone}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {selectedOrder.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.medicineName}</Text>
                <Text style={styles.itemGeneric}>{item.genericName}</Text>
                <Text style={styles.itemManufacturer}>{item.manufacturer}</Text>
                <Text style={styles.itemQuantity}>
                  {item.quantity} {item.unit} × ₹{item.unitPrice}
                </Text>
              </View>
              <Text style={styles.itemTotal}>₹{item.totalPrice}</Text>
            </View>
          ))}
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₹{selectedOrder.totalAmount}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Charges</Text>
            <Text style={styles.priceValue}>
              {selectedOrder.deliveryCharges === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharges}`}
            </Text>
          </View>
          {selectedOrder.discountAmount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Discount</Text>
              <Text style={[styles.priceValue, styles.discountText]}>
                -₹{selectedOrder.discountAmount}
              </Text>
            </View>
          )}
          <View style={styles.separator} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{selectedOrder.finalAmount}</Text>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryLabel}>Address:</Text>
            <Text style={styles.deliveryText}>{selectedOrder.deliveryAddress}</Text>
          </View>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryLabel}>Phone:</Text>
            <Text style={styles.deliveryText}>{selectedOrder.customerPhone}</Text>
          </View>
          {selectedOrder.specialInstructions && (
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryLabel}>Special Instructions:</Text>
              <Text style={styles.deliveryText}>{selectedOrder.specialInstructions}</Text>
            </View>
          )}
        </View>

        {/* Tracking History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking History</Text>
          <FlatList
            data={selectedOrder.trackingHistory}
            renderItem={renderTrackingStep}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Method:</Text>
            <Text style={styles.paymentText}>{selectedOrder.paymentMethod}</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Status:</Text>
            <Text style={[
              styles.paymentText,
              { color: selectedOrder.paymentStatus === 'PAID' ? '#34C759' : '#FF9500' }
            ]}>
              {selectedOrder.paymentStatus}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Tracking</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={onRefresh} style={styles.headerButton}>
            <Ionicons name="refresh-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAllOrders} style={styles.headerButton}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Orders List */}
        <View style={styles.ordersPanel}>
          <Text style={styles.panelTitle}>Your Orders</Text>
          <FlatList
            data={orders}
            renderItem={renderOrderCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>

        {/* Order Details */}
        <View style={styles.detailsPanel}>
          {selectedOrder ? (
            renderOrderDetails()
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>Select an order to view details</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  ordersPanel: {
    width: '40%',
    backgroundColor: '#FFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E5E7',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  orderCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedOrderCard: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  orderShop: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  detailsPanel: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  orderDetails: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E5E7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  currentStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  deliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  shopInfo: {
    marginTop: 8,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  shopAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  shopPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  shopPhoneText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  itemGeneric: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemManufacturer: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#000',
  },
  discountText: {
    color: '#34C759',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E7',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  deliveryInfo: {
    marginBottom: 8,
  },
  deliveryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  deliveryText: {
    fontSize: 14,
    color: '#000',
    marginTop: 2,
  },
  trackingStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  trackingLine: {
    alignItems: 'center',
    marginRight: 12,
  },
  trackingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CCC',
  },
  activeTrackingDot: {
    backgroundColor: '#007AFF',
  },
  trackingConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#CCC',
    marginTop: 4,
  },
  trackingContent: {
    flex: 1,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  trackingStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'capitalize',
  },
  activeTrackingStatus: {
    color: '#007AFF',
  },
  trackingTime: {
    fontSize: 12,
    color: '#888',
  },
  trackingDescription: {
    fontSize: 14,
    color: '#000',
  },
  trackingLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
});