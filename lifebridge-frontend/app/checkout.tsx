import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { saveOrder } from '../utils/orderStorage';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  prescriptionRequired: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export default function CheckoutScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [saveAddress, setSaveAddress] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Only UPI and Cash on Delivery payment methods
  const paymentMethods: PaymentMethod[] = [
    { id: 'CASH_ON_DELIVERY', name: 'Cash on Delivery', icon: 'cash-outline' },
    { id: 'UPI', name: 'UPI Payment', icon: 'card-outline' }
  ];

  useEffect(() => {
    // Parse cart data from navigation parameters
    if (params.cartData && typeof params.cartData === 'string') {
      try {
        const parsedCart = JSON.parse(params.cartData);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        Alert.alert('Error', 'Invalid cart data received');
      }
    }
  }, [params.cartData]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDeliveryCharges = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 500 ? 0 : 50; // Free delivery above ₹500
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryCharges();
  };

  const placeOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter delivery address');
      return;
    }

    if (!customerPhone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Error', 'No items in cart');
      return;
    }

    if (selectedPaymentMethod === 'UPI') {
      // For UPI payment, redirect to payment screen with fixed UPI details
      router.push({
        pathname: '/payment',
        params: {
          orderData: JSON.stringify({
            items: cartItems,
            deliveryAddress,
            customerPhone,
            specialInstructions,
            totalAmount: calculateTotal(),
            paymentMethod: selectedPaymentMethod
          })
        }
      });
      return;
    }

    // For Cash on Delivery, place order directly
    const orderData = {
      medicalShopId: 1, // Would be selected based on medicines
      deliveryAddress,
      customerPhone,
      specialInstructions,
      paymentMethod: selectedPaymentMethod,
      items: cartItems.map(item => ({
        medicineId: item.id,
        quantity: item.quantity,
        prescriptionImageUrl: null // Would be uploaded for prescription medicines
      }))
    };

    try {
      // Save order to storage
      const savedOrder = await saveOrder({
        items: cartItems,
        deliveryAddress,
        customerPhone,
        specialInstructions,
        totalAmount: calculateTotal(),
        paymentMethod: selectedPaymentMethod
      });
      
      Alert.alert(
        'Order Placed Successfully!',
        `Order Number: ${savedOrder.orderNumber}\nPayment: Cash on Delivery\nTotal: ₹${savedOrder.finalAmount.toFixed(2)}`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              router.push('/order-tracking');
            }
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const renderCartSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      {cartItems.map((item) => (
        <View key={item.id} style={styles.cartItem}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              {item.quantity} {item.unit} × ₹{item.price}
            </Text>
          </View>
          <Text style={styles.itemTotal}>₹{(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      ))}
      
      <View style={styles.separator} />
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Subtotal</Text>
        <Text style={styles.priceValue}>₹{calculateSubtotal().toFixed(2)}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Delivery Charges</Text>
        <Text style={[styles.priceValue, calculateDeliveryCharges() === 0 && styles.freeText]}>
          {calculateDeliveryCharges() === 0 ? 'FREE' : `₹${calculateDeliveryCharges()}`}
        </Text>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.priceRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>₹{calculateTotal().toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderDeliveryInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Delivery Address *</Text>
        <TextInput
          style={[styles.textInput, styles.addressInput]}
          placeholder="Enter complete delivery address..."
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter phone number"
          value={customerPhone}
          onChangeText={setCustomerPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Special Instructions (Optional)</Text>
        <TextInput
          style={[styles.textInput, styles.instructionsInput]}
          placeholder="Any special delivery instructions..."
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Save this address for future orders</Text>
        <Switch
          value={saveAddress}
          onValueChange={setSaveAddress}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={saveAddress ? '#007AFF' : '#f4f3f4'}
        />
      </View>
    </View>
  );

  const renderPaymentMethods = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentMethod,
            selectedPaymentMethod === method.id && styles.selectedPaymentMethod
          ]}
          onPress={() => setSelectedPaymentMethod(method.id)}
        >
          <View style={styles.paymentMethodLeft}>
            <Ionicons
              name={method.icon as any}
              size={24}
              color={selectedPaymentMethod === method.id ? '#007AFF' : '#666'}
            />
            <Text style={[
              styles.paymentMethodName,
              selectedPaymentMethod === method.id && styles.selectedPaymentMethodText
            ]}>
              {method.name}
            </Text>
          </View>
          <View style={[
            styles.radioButton,
            selectedPaymentMethod === method.id && styles.selectedRadioButton
          ]}>
            {selectedPaymentMethod === method.id && (
              <View style={styles.radioButtonInner} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCartSummary()}
        {renderDeliveryInfo()}
        {renderPaymentMethods()}
        
        <View style={styles.section}>
          <View style={styles.deliveryEstimate}>
            <Ionicons name="time-outline" size={20} color="#34C759" />
            <Text style={styles.deliveryText}>
              Estimated delivery time: 30-60 minutes
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotal}>Total: ₹{calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderButton} onPress={placeOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
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
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E7',
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    color: '#000',
  },
  freeText: {
    color: '#34C759',
    fontWeight: 'bold',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  addressInput: {
    height: 80,
  },
  instructionsInput: {
    height: 60,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPaymentMethod: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  selectedPaymentMethodText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: '#007AFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  deliveryEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: '#34C759',
    marginLeft: 8,
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  totalContainer: {
    marginBottom: 12,
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  placeOrderButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
  },
  placeOrderText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});