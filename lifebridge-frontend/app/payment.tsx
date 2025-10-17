import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { saveOrder, updateOrderStatus } from '../utils/orderStorage';

interface PaymentData {
  orderId: number;
  amount: number;
  paymentMethod: string;
  orderNumber: string;
}

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

interface UPIDetails {
  upiId: string;
}

type PaymentStep = 'method' | 'details' | 'processing' | 'gateway' | 'success' | 'failure';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    orderId: 1,
    amount: 0,
    paymentMethod: 'UPI',
    orderNumber: 'LB' + Date.now()
  });
  
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<'success' | 'failure' | null>(null);

  // Fixed UPI ID for all transactions - LifeBridge main account
  const FIXED_UPI_ID = 'lifebridge@paytm'; // You can change this to your actual UPI ID

  // Only UPI payment method for this screen
  const paymentMethods = [
    {
      id: 'UPI',
      name: 'UPI Payment',
      icon: 'card-outline',
      description: 'Pay using UPI (Google Pay, PhonePe, Paytm, etc.)'
    }
  ];

  useEffect(() => {
    // Parse order data from checkout screen
    if (params.orderData && typeof params.orderData === 'string') {
      try {
        const parsedOrder = JSON.parse(params.orderData);
        setOrderDetails(parsedOrder);
        setPaymentData(prev => ({
          ...prev,
          amount: parsedOrder.totalAmount,
          paymentMethod: parsedOrder.paymentMethod
        }));
      } catch (error) {
        console.error('Error parsing order data:', error);
        Alert.alert('Error', 'Invalid order data received');
      }
    }
  }, [params.orderData]);

  const initiatePayment = async () => {
    try {
      setProcessing(true);
      setCurrentStep('processing');

      // Generate UPI payment URL
      const upiUrl = `upi://pay?pa=${FIXED_UPI_ID}&pn=LifeBridge%20Medicines&am=${paymentData.amount}&cu=INR&tn=Medicine%20Order%20${paymentData.orderNumber}`;
      
      // Try to open UPI app
      const supported = await Linking.canOpenURL(upiUrl);
      
      if (supported) {
        await Linking.openURL(upiUrl);
        
        // Show payment confirmation dialog after UPI redirect
        setTimeout(() => {
          Alert.alert(
            'Payment Status',
            'Did you complete the payment?',
            [
              {
                text: 'Yes, Payment Done',
                onPress: async () => {
                  try {
                    // Save order to storage
                    const savedOrder = await saveOrder(orderDetails);
                    
                    // Update payment data with saved order info
                    setPaymentData(prev => ({
                      ...prev,
                      orderNumber: savedOrder.orderNumber
                    }));
                    
                    setPaymentResult('success');
                    setCurrentStep('success');
                  } catch (error) {
                    console.error('Error saving order:', error);
                    Alert.alert('Error', 'Failed to save order details');
                  }
                }
              },
              {
                text: 'Payment Failed',
                onPress: () => {
                  setPaymentResult('failure');
                  setCurrentStep('failure');
                }
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  setProcessing(false);
                  setCurrentStep('method');
                }
              }
            ]
          );
        }, 2000);
      } else {
        // If UPI app not available, show manual payment details
        setCurrentStep('gateway');
      }

    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to initiate UPI payment');
      setProcessing(false);
      setCurrentStep('method');
    }
  };

  const proceedToPayment = () => {
    initiatePayment();
  };

  const renderMethodSelection = () => (
    <ScrollView style={styles.methodContainer}>
      <Text style={styles.stepTitle}>Select Payment Method</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount to Pay</Text>
        <Text style={styles.amount}>₹{paymentData.amount.toFixed(2)}</Text>
        <Text style={styles.orderNumber}>Order: {paymentData.orderNumber}</Text>
      </View>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            selectedMethod === method.id && styles.selectedMethodCard
          ]}
          onPress={() => {
            setSelectedMethod(method.id);
            if (method.id === 'CASH_ON_DELIVERY') {
              setCurrentStep('processing');
              initiatePayment();
            } else {
              setCurrentStep('details');
            }
          }}
        >
          <View style={styles.methodIcon}>
            <Ionicons name={method.icon as any} size={24} color="#007AFF" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>{method.name}</Text>
            <Text style={styles.methodDescription}>{method.description}</Text>
          </View>
          <View style={styles.methodRadio}>
            {selectedMethod === method.id && (
              <View style={styles.radioSelected} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderPaymentDetails = () => (
    <ScrollView style={styles.detailsContainer}>
      <Text style={styles.stepTitle}>UPI Payment Details</Text>

      <View style={styles.formContainer}>
        <View style={styles.upiInfoContainer}>
          <Ionicons name="card-outline" size={48} color="#007AFF" />
          <Text style={styles.upiTitle}>Pay via UPI</Text>
          <Text style={styles.upiDescription}>
            Payment will be made to LifeBridge Medicines
          </Text>
          <View style={styles.upiIdContainer}>
            <Text style={styles.upiIdLabel}>UPI ID:</Text>
            <Text style={styles.upiIdText}>{FIXED_UPI_ID}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount to Pay:</Text>
            <Text style={styles.amountText}>₹{paymentData.amount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.securityInfo}>
        <Ionicons name="shield-checkmark-outline" size={20} color="#34C759" />
        <Text style={styles.securityText}>
          Secure payment via UPI - Click below to open your UPI app
        </Text>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={proceedToPayment}>
        <Ionicons name="card-outline" size={20} color="#FFF" style={styles.payButtonIcon} />
        <Text style={styles.payButtonText}>
          Pay ₹{paymentData.amount.toFixed(2)} via UPI
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderProcessing = () => (
    <View style={styles.processingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.processingTitle}>Processing Payment...</Text>
      <Text style={styles.processingText}>
        Please wait while we process your payment securely
      </Text>
      <Text style={styles.processingAmount}>₹{paymentData.amount.toFixed(2)}</Text>
    </View>
  );

  const renderGateway = () => (
    <View style={styles.gatewayContainer}>
      <View style={styles.webviewPlaceholder}>
        <Ionicons name="card-outline" size={64} color="#007AFF" />
        <Text style={styles.gatewayTitle}>Manual UPI Payment</Text>
        <Text style={styles.gatewayText}>
          UPI app not found. Please make payment manually using the details below:
        </Text>
        <View style={styles.manualPaymentDetails}>
          <Text style={styles.paymentDetailLabel}>UPI ID:</Text>
          <Text style={styles.paymentDetailValue}>{FIXED_UPI_ID}</Text>
          <Text style={styles.paymentDetailLabel}>Amount:</Text>
          <Text style={styles.paymentDetailValue}>₹{paymentData.amount.toFixed(2)}</Text>
          <Text style={styles.paymentDetailLabel}>Note:</Text>
          <Text style={styles.paymentDetailValue}>Medicine Order {paymentData.orderNumber}</Text>
        </View>
        
        <View style={styles.gatewayButtons}>
          <TouchableOpacity
            style={[styles.gatewayButton, { backgroundColor: '#34C759' }]}
            onPress={async () => {
              try {
                // Save order to storage
                const savedOrder = await saveOrder(orderDetails);
                
                // Update payment data with saved order info
                setPaymentData(prev => ({
                  ...prev,
                  orderNumber: savedOrder.orderNumber
                }));
                
                setPaymentResult('success');
                setCurrentStep('success');
              } catch (error) {
                console.error('Error saving order:', error);
                Alert.alert('Error', 'Failed to save order details');
              }
            }}
          >
            <Text style={styles.gatewayButtonText}>Payment Completed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.gatewayButton, { backgroundColor: '#FF3B30' }]}
            onPress={() => {
              router.back();
            }}
          >
            <Text style={styles.gatewayButtonText}>Cancel Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderResult = () => {
    const isSuccess = paymentResult === 'success';
    
    return (
      <View style={styles.resultContainer}>
        <View style={[
          styles.resultIcon,
          { backgroundColor: isSuccess ? '#34C759' : '#FF3B30' }
        ]}>
          <Ionicons
            name={isSuccess ? 'checkmark' : 'close'}
            size={48}
            color="#FFF"
          />
        </View>

        <Text style={styles.resultTitle}>
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </Text>

        <Text style={styles.resultMessage}>
          {isSuccess
            ? 'Your order has been placed successfully. You will receive a confirmation shortly.'
            : 'There was an issue processing your payment. Please try again.'
          }
        </Text>

        {isSuccess && (
          <View style={styles.orderInfo}>
            <Text style={styles.orderInfoLabel}>Order Number</Text>
            <Text style={styles.orderInfoValue}>{paymentData.orderNumber}</Text>
            <Text style={styles.orderInfoLabel}>Amount Paid</Text>
            <Text style={styles.orderInfoValue}>₹{paymentData.amount.toFixed(2)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.resultButton,
            { backgroundColor: isSuccess ? '#007AFF' : '#FF3B30' }
          ]}
          onPress={() => {
            if (isSuccess) {
              // Navigate to order tracking
              router.push('/order-tracking');
            } else {
              // Retry payment
              setCurrentStep('method');
              setPaymentResult(null);
            }
          }}
        >
          <Text style={styles.resultButtonText}>
            {isSuccess ? 'Track Order' : 'Try Again'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            if (isSuccess) {
              router.push('/order-medicines');
            } else {
              router.back();
            }
          }}
        >
          <Text style={styles.secondaryButtonText}>
            {isSuccess ? 'Continue Shopping' : 'Back to Checkout'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>UPI Payment</Text>
        <View style={styles.placeholder} />
      </View>

      {currentStep === 'method' && renderMethodSelection()}
      {currentStep === 'details' && renderPaymentDetails()}
      {currentStep === 'processing' && renderProcessing()}
      {currentStep === 'gateway' && renderGateway()}
      {(currentStep === 'success' || currentStep === 'failure') && renderResult()}
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
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  methodContainer: {
    flex: 1,
    padding: 16,
  },
  amountContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginVertical: 4,
  },
  orderNumber: {
    fontSize: 12,
    color: '#888',
  },
  methodCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  selectedMethodCard: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    color: '#34C759',
    marginLeft: 8,
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
  },
  processingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  processingAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 16,
  },
  gatewayContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  resultMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  orderInfo: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  orderInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  resultButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  webviewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFF',
  },
  gatewayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
  },
  gatewayText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  gatewayUrl: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  gatewayButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  gatewayButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  gatewayButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  upiInfoContainer: {
    alignItems: 'center',
    padding: 20,
  },
  upiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 12,
  },
  upiDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  upiIdContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 12,
  },
  upiIdLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  upiIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  payButtonIcon: {
    marginRight: 8,
  },
  manualPaymentDetails: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginTop: 16,
    marginBottom: 24,
  },
  paymentDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  paymentDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
});