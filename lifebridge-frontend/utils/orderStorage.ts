import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OrderItem {
  medicineName: string;
  genericName: string;
  manufacturer: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

export interface TrackingHistory {
  status: string;
  timestamp: string;
  description: string;
  location: string;
}

export interface Order {
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
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  items: OrderItem[];
  trackingHistory: TrackingHistory[];
}

export const saveOrder = async (orderData: any): Promise<Order> => {
  try {
    const orderNumber = 'LB' + Date.now();
    const currentTime = new Date().toISOString();
    const estimatedDelivery = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now

    const newOrder: Order = {
      id: Date.now(),
      orderNumber,
      totalAmount: orderData.totalAmount || 0,
      deliveryCharges: orderData.totalAmount >= 500 ? 0 : 50,
      discountAmount: 0,
      finalAmount: (orderData.totalAmount || 0) + (orderData.totalAmount >= 500 ? 0 : 50),
      status: orderData.paymentMethod === 'CASH_ON_DELIVERY' ? 'CONFIRMED' : 'PENDING',
      paymentStatus: orderData.paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      paymentMethod: orderData.paymentMethod,
      deliveryAddress: orderData.deliveryAddress,
      customerPhone: orderData.customerPhone,
      specialInstructions: orderData.specialInstructions,
      orderDateTime: currentTime,
      estimatedDeliveryTime: estimatedDelivery,
      shopName: 'LifeBridge Pharmacy',
      shopAddress: '123 Medical District, Health Plaza',
      shopPhone: '+1-234-567-9000',
      items: orderData.items.map((item: any) => ({
        medicineName: item.name,
        genericName: item.genericName || item.name,
        manufacturer: item.manufacturer || 'Generic',
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        unit: item.unit || 'tablets'
      })),
      trackingHistory: [
        {
          status: 'PLACED',
          timestamp: currentTime,
          description: 'Order placed successfully',
          location: 'Online'
        },
        ...(orderData.paymentMethod === 'CASH_ON_DELIVERY' ? [{
          status: 'CONFIRMED',
          timestamp: currentTime,
          description: 'Order confirmed - Cash on Delivery',
          location: 'LifeBridge Pharmacy'
        }] : [])
      ]
    };

    // Get existing orders
    const storedOrders = await AsyncStorage.getItem('lifebridge_orders');
    let orders: Order[] = [];
    
    if (storedOrders) {
      orders = JSON.parse(storedOrders);
    }
    
    // Add new order at the beginning (most recent first)
    orders.unshift(newOrder);
    
    // Save back to storage
    await AsyncStorage.setItem('lifebridge_orders', JSON.stringify(orders));
    
    return newOrder;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderNumber: string, status: string, paymentStatus?: string) => {
  try {
    const storedOrders = await AsyncStorage.getItem('lifebridge_orders');
    if (!storedOrders) return;
    
    let orders: Order[] = JSON.parse(storedOrders);
    const orderIndex = orders.findIndex(order => order.orderNumber === orderNumber);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      if (paymentStatus) {
        orders[orderIndex].paymentStatus = paymentStatus;
      }
      
      // Add tracking history
      orders[orderIndex].trackingHistory.push({
        status,
        timestamp: new Date().toISOString(),
        description: getStatusDescription(status),
        location: 'LifeBridge Pharmacy'
      });
      
      await AsyncStorage.setItem('lifebridge_orders', JSON.stringify(orders));
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

const getStatusDescription = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'CONFIRMED': return 'Order confirmed by pharmacy';
    case 'PREPARING': return 'Medicines being prepared';
    case 'PACKED': return 'Order packed and ready for dispatch';
    case 'SHIPPED': return 'Order dispatched from pharmacy';
    case 'OUT_FOR_DELIVERY': return 'Order is out for delivery';
    case 'DELIVERED': return 'Order delivered successfully';
    case 'CANCELLED': return 'Order cancelled';
    default: return 'Order status updated';
  }
};