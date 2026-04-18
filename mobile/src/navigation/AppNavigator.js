import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import HomeScreen          from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen          from '../screens/CartScreen';
import useStore            from '../store/useStore';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Tab Icons ──────────────────────────────────────────────
const TabIcon = ({ icon, label, focused }) => (
  <View style={{ alignItems: 'center', paddingTop: 4 }}>
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
    <Text style={{ fontSize: 9, color: focused ? '#E94560' : '#999', fontWeight: focused ? '700' : '400', marginTop: 2 }}>
      {label}
    </Text>
  </View>
);

// ─── Home Stack ─────────────────────────────────────────────
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain"      component={HomeScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Cart"          component={CartScreen} />
  </Stack.Navigator>
);

// ─── Products Stack (placeholder, reuse HomeStack) ──────────
const ProductsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProductsList"  component={HomeScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
  </Stack.Navigator>
);

// ─── Wishlist Placeholder ───────────────────────────────────
const WishlistPlaceholder = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F7F4' }}>
    <Text style={{ fontSize: 48, marginBottom: 12 }}>❤️</Text>
    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a2e' }}>My Wishlist</Text>
    <Text style={{ color: '#888', marginTop: 6 }}>Your saved items will appear here</Text>
  </View>
);

// ─── Profile Placeholder ────────────────────────────────────
const ProfilePlaceholder = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F7F4' }}>
    <Text style={{ fontSize: 48, marginBottom: 12 }}>👤</Text>
    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a2e' }}>My Profile</Text>
    <Text style={{ color: '#888', marginTop: 6 }}>Login to view orders & settings</Text>
  </View>
);

// ─── Bottom Tab Navigator ───────────────────────────────────
const BottomTabs = () => {
  const cartCount = useStore(s => s.cart.reduce((sum, i) => sum + i.qty, 0));

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 4,
          elevation: 20,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 16,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home"     focused={focused} /> }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="👗" label="Shop"     focused={focused} /> }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistPlaceholder}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="❤️" label="Wishlist" focused={focused} /> }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon icon="🛒" label="Cart" focused={focused} />
              {cartCount > 0 && (
                <View style={{
                  position: 'absolute', top: -2, right: -6,
                  backgroundColor: '#E94560', borderRadius: 8,
                  width: 16, height: 16, alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '800' }}>{cartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePlaceholder}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile"  focused={focused} /> }}
      />
    </Tab.Navigator>
  );
};

// ─── Root Navigator ─────────────────────────────────────────
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main"     component={BottomTabs} />
      <Stack.Screen name="Checkout" component={HomeScreen} />  {/* replace with CheckoutScreen */}
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
