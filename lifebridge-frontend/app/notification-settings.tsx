import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface NotificationSettings {
  orderPlaced: boolean;
  orderConfirmed: boolean;
  orderPacked: boolean;
  orderShipped: boolean;
  orderOutForDelivery: boolean;
  orderDelivered: boolean;
  orderCancelled: boolean;
  paymentSuccess: boolean;
  paymentFailed: boolean;
  medicineReminders: boolean;
  inventoryAlerts: boolean;
  promotionalOffers: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  settings: Array<{
    key: keyof NotificationSettings;
    label: string;
    description: string;
  }>;
}

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState<NotificationSettings>({
    orderPlaced: true,
    orderConfirmed: true,
    orderPacked: true,
    orderShipped: true,
    orderOutForDelivery: true,
    orderDelivered: true,
    orderCancelled: true,
    paymentSuccess: true,
    paymentFailed: true,
    medicineReminders: true,
    inventoryAlerts: false,
    promotionalOffers: false,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const notificationCategories: NotificationCategory[] = [
    {
      id: 'order_updates',
      title: 'Order Updates',
      description: 'Get notified about your medicine order status',
      icon: 'medical-outline',
      settings: [
        {
          key: 'orderPlaced',
          label: 'Order Placed',
          description: 'When your order is successfully placed'
        },
        {
          key: 'orderConfirmed',
          label: 'Order Confirmed',
          description: 'When pharmacy confirms your order'
        },
        {
          key: 'orderPacked',
          label: 'Order Packed',
          description: 'When your medicines are packed'
        },
        {
          key: 'orderShipped',
          label: 'Order Shipped',
          description: 'When your order is shipped'
        },
        {
          key: 'orderOutForDelivery',
          label: 'Out for Delivery',
          description: 'When your order is out for delivery'
        },
        {
          key: 'orderDelivered',
          label: 'Order Delivered',
          description: 'When your order is successfully delivered'
        },
        {
          key: 'orderCancelled',
          label: 'Order Cancelled',
          description: 'When your order gets cancelled'
        }
      ]
    },
    {
      id: 'payment_updates',
      title: 'Payment Updates',
      description: 'Payment and transaction notifications',
      icon: 'card-outline',
      settings: [
        {
          key: 'paymentSuccess',
          label: 'Payment Success',
          description: 'When payment is processed successfully'
        },
        {
          key: 'paymentFailed',
          label: 'Payment Failed',
          description: 'When payment processing fails'
        }
      ]
    },
    {
      id: 'health_reminders',
      title: 'Health & Reminders',
      description: 'Medicine reminders and health alerts',
      icon: 'time-outline',
      settings: [
        {
          key: 'medicineReminders',
          label: 'Medicine Reminders',
          description: 'Reminders to take your medicines on time'
        }
      ]
    },
    {
      id: 'shop_management',
      title: 'Shop Management',
      description: 'For medical shop owners only',
      icon: 'storefront-outline',
      settings: [
        {
          key: 'inventoryAlerts',
          label: 'Inventory Alerts',
          description: 'Low stock and inventory notifications'
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Offers & Promotions',
      description: 'Special offers and promotional content',
      icon: 'gift-outline',
      settings: [
        {
          key: 'promotionalOffers',
          label: 'Promotional Offers',
          description: 'Special discounts and offers on medicines'
        }
      ]
    }
  ];

  const deliveryMethods = [
    {
      key: 'emailNotifications' as keyof NotificationSettings,
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: 'mail-outline'
    },
    {
      key: 'smsNotifications' as keyof NotificationSettings,
      label: 'SMS Notifications',
      description: 'Receive notifications via SMS',
      icon: 'chatbubble-outline'
    },
    {
      key: 'pushNotifications' as keyof NotificationSettings,
      label: 'Push Notifications',
      description: 'Receive push notifications on your device',
      icon: 'notifications-outline'
    }
  ];

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, load settings from backend
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      Alert.alert('Error', 'Failed to load notification settings');
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      const response = await fetch('http://localhost:8080/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_TOKEN_HERE'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      Alert.alert('Success', 'Notification settings saved successfully');
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const enableAllNotifications = () => {
    const allEnabled: NotificationSettings = {} as NotificationSettings;
    Object.keys(settings).forEach(key => {
      allEnabled[key as keyof NotificationSettings] = true;
    });
    setSettings(allEnabled);
  };

  const disableAllNotifications = () => {
    const allDisabled: NotificationSettings = {} as NotificationSettings;
    Object.keys(settings).forEach(key => {
      allDisabled[key as keyof NotificationSettings] = false;
    });
    setSettings(allDisabled);
  };

  const testNotification = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_TOKEN_HERE'
        }
      });

      if (response.ok) {
        Alert.alert('Success', 'Test notification sent! Please check your devices.');
      } else {
        throw new Error('Failed to send test notification');
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Notification Settings</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Notification Settings</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveSettings}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, styles.enableAllButton]}
            onPress={enableAllNotifications}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#34C759" />
            <Text style={[styles.quickActionText, { color: '#34C759' }]}>
              Enable All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, styles.disableAllButton]}
            onPress={disableAllNotifications}
          >
            <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
            <Text style={[styles.quickActionText, { color: '#FF3B30' }]}>
              Disable All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, styles.testButton]}
            onPress={testNotification}
          >
            <Ionicons name="send-outline" size={20} color="#007AFF" />
            <Text style={[styles.quickActionText, { color: '#007AFF' }]}>
              Test
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Methods</Text>
          <View style={styles.sectionCard}>
            {deliveryMethods.map((method) => (
              <View key={method.key} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={styles.settingIcon}>
                    <Ionicons name={method.icon as any} size={20} color="#007AFF" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>{method.label}</Text>
                    <Text style={styles.settingDescription}>{method.description}</Text>
                  </View>
                </View>
                <Switch
                  value={settings[method.key]}
                  onValueChange={(value) => updateSetting(method.key, value)}
                  trackColor={{ false: '#E5E5E7', true: '#007AFF' }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Notification Categories */}
        {notificationCategories.map((category) => (
          <View key={category.id} style={styles.section}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon as any} size={20} color="#007AFF" />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.sectionTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </View>

            <View style={styles.sectionCard}>
              {category.settings.map((setting) => (
                <View key={setting.key} style={styles.settingItem}>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>{setting.label}</Text>
                    <Text style={styles.settingDescription}>{setting.description}</Text>
                  </View>
                  <Switch
                    value={settings[setting.key]}
                    onValueChange={(value) => updateSetting(setting.key, value)}
                    trackColor={{ false: '#E5E5E7', true: '#007AFF' }}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#34C759" />
          <Text style={styles.privacyText}>
            Your notification preferences are stored securely and can be changed anytime.
            We respect your privacy and will only send relevant notifications.
          </Text>
        </View>
      </ScrollView>
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
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  enableAllButton: {
    borderColor: '#34C759',
    backgroundColor: '#F0FFF0',
  },
  disableAllButton: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF0F0',
  },
  testButton: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9F0',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: '#34C759',
    lineHeight: 20,
  },
});