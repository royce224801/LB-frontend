import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Medicine {
  id: number;
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
  shopName: string;
  shopId: number;
}

interface CartItem extends Medicine {
  quantity: number;
}

export default function OrderMedicinesScreen() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Pain Relief', 'Antibiotics', 'Vitamins', 'Cold & Flu', 'Diabetes', 'Heart'];

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [medicines, searchQuery, selectedCategory]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockMedicines: Medicine[] = [
        {
          id: 1,
          name: "Paracetamol 500mg",
          genericName: "Acetaminophen",
          manufacturer: "PharmaCorp",
          price: 25.50,
          stockQuantity: 100,
          unit: "tablets",
          expiryDate: "2026-12-31",
          description: "Effective pain relief and fever reducer",
          category: "Pain Relief",
          prescriptionRequired: "NO",
          imageUrl: "https://via.placeholder.com/100x100?text=Paracetamol",
          isActive: true,
          shopName: "LifeCare Pharmacy",
          shopId: 1
        },
        {
          id: 2,
          name: "Amoxicillin 250mg",
          genericName: "Amoxicillin",
          manufacturer: "MediPharm",
          price: 45.00,
          stockQuantity: 50,
          unit: "capsules",
          expiryDate: "2026-08-15",
          description: "Antibiotic for bacterial infections",
          category: "Antibiotics",
          prescriptionRequired: "YES",
          imageUrl: "https://via.placeholder.com/100x100?text=Amoxicillin",
          isActive: true,
          shopName: "MediCenter Pharmacy",
          shopId: 2
        },
        {
          id: 3,
          name: "Vitamin C 1000mg",
          genericName: "Ascorbic Acid",
          manufacturer: "HealthPlus",
          price: 35.00,
          stockQuantity: 200,
          unit: "tablets",
          expiryDate: "2027-03-20",
          description: "Immune system booster",
          category: "Vitamins",
          prescriptionRequired: "NO",
          imageUrl: "https://via.placeholder.com/100x100?text=VitaminC",
          isActive: true,
          shopName: "Wellness Pharmacy",
          shopId: 3
        },
        {
          id: 4,
          name: "Omeprazole 20mg",
          genericName: "Omeprazole",
          manufacturer: "GastroCare",
          price: 65.00,
          stockQuantity: 75,
          unit: "capsules",
          expiryDate: "2026-10-05",
          description: "Reduces stomach acid production",
          category: "Digestive",
          prescriptionRequired: "YES",
          imageUrl: "https://via.placeholder.com/100x100?text=Omeprazole",
          isActive: true,
          shopName: "LifeCare Pharmacy",
          shopId: 1
        },
        {
          id: 5,
          name: "Cetirizine 10mg",
          genericName: "Cetirizine",
          manufacturer: "AllergyCare",
          price: 28.00,
          stockQuantity: 150,
          unit: "tablets",
          expiryDate: "2026-06-12",
          description: "Antihistamine for allergies",
          category: "Allergy",
          prescriptionRequired: "NO",
          imageUrl: "https://via.placeholder.com/100x100?text=Cetirizine",
          isActive: true,
          shopName: "Wellness Pharmacy",
          shopId: 3
        },
        {
          id: 6,
          name: "Ibuprofen 400mg",
          genericName: "Ibuprofen",
          manufacturer: "PainRelief Inc",
          price: 32.00,
          stockQuantity: 120,
          unit: "tablets",
          expiryDate: "2026-11-30",
          description: "Anti-inflammatory pain reliever",
          category: "Pain Relief",
          prescriptionRequired: "NO",
          imageUrl: "https://via.placeholder.com/100x100?text=Ibuprofen",
          isActive: true,
          shopName: "MediCenter Pharmacy",
          shopId: 2
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMedicines(mockMedicines);
      
    } catch (error) {
      console.error('Error fetching medicines:', error);
      Alert.alert('Error', 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const filterMedicines = () => {
    let filtered = medicines;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(medicine => medicine.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMedicines(filtered);
  };

  const addToCart = (medicine: Medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    
    if (existingItem) {
      if (existingItem.quantity < medicine.stockQuantity) {
        setCart(cart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        Alert.alert('Stock Limit', 'Cannot add more items than available in stock');
      }
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (medicineId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(medicineId);
    } else {
      const medicine = medicines.find(m => m.id === medicineId);
      if (medicine && newQuantity <= medicine.stockQuantity) {
        setCart(cart.map(item =>
          item.id === medicineId
            ? { ...item, quantity: newQuantity }
            : item
        ));
      } else {
        Alert.alert('Stock Limit', 'Quantity exceeds available stock');
      }
    }
  };

  const removeFromCart = (medicineId: number) => {
    setCart(cart.filter(item => item.id !== medicineId));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add medicines to cart before proceeding');
      return;
    }

    // Close cart modal and navigate to checkout
    setShowCart(false);
    
    // Pass cart data to checkout screen
    router.push({
      pathname: '/checkout',
      params: { 
        cartData: JSON.stringify(cart),
        totalAmount: getTotalAmount().toString()
      }
    });
  };

  const renderMedicine = ({ item }: { item: Medicine }) => (
    <View style={styles.medicineCard}>
      <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/80' }} style={styles.medicineImage} />
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.genericName}>{item.genericName}</Text>
        <Text style={styles.manufacturer}>{item.manufacturer}</Text>
        <Text style={styles.shopName}>Shop: {item.shopName}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.unit}>per {item.unit}</Text>
        </View>
        <Text style={styles.stock}>Stock: {item.stockQuantity}</Text>
        {item.prescriptionRequired === 'YES' && (
          <Text style={styles.prescription}>⚕️ Prescription Required</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}
        disabled={item.stockQuantity === 0}
      >
        <Text style={styles.addButtonText}>
          {item.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/50' }} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>₹{item.price} x {item.quantity}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateCartQuantity(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateCartQuantity(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Ionicons name="trash-outline" size={16} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Medicines</Text>
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => setShowCart(true)}
        >
          <Ionicons name="cart" size={24} color="#007AFF" />
          {getTotalItems() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category === 'all' ? 'All' : category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredMedicines}
        renderItem={renderMedicine}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.medicinesList}
        refreshing={loading}
        onRefresh={fetchMedicines}
      />

      {/* Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.cartModal}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>Shopping Cart</Text>
            <TouchableOpacity onPress={() => setShowCart(false)}>
              <Ionicons name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {cart.length === 0 ? (
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={64} color="#CCC" />
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={cart}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.cartList}
              />
              <View style={styles.cartFooter}>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>Total: ₹{getTotalAmount().toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={proceedToCheckout}
                >
                  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
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
  cartIcon: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#FFF',
  },
  medicinesList: {
    paddingHorizontal: 16,
  },
  medicineCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
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
    marginTop: 2,
  },
  shopName: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  unit: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  stock: {
    fontSize: 12,
    color: '#34C759',
    marginTop: 2,
  },
  prescription: {
    fontSize: 12,
    color: '#FF9500',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartModal: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cartItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 4,
  },
  cartFooter: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  totalContainer: {
    marginBottom: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});