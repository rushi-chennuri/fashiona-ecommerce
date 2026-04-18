import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useStore from '../store/useStore';
import { formatPrice } from '../utils/theme';

const CartScreen = ({ navigation }) => {
  const { cart, removeFromCart, updateQty, cartTotal } = useStore();

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const handleRemove = (item) => {
    Alert.alert('Remove Item', `Remove ${item.name} from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.size, item.color) },
    ]);
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Add some fabulous items to get started!</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('HomeTab')}>
          <Text style={styles.shopBtnText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart ({cart.length})</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Free shipping progress */}
      {cartTotal < 999 && (
        <View style={styles.progressBar}>
          <Text style={styles.progressText}>
            Add {formatPrice(999 - cartTotal)} more for FREE shipping 🚚
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min((cartTotal / 999) * 100, 100)}%` }]} />
          </View>
        </View>
      )}
      {cartTotal >= 999 && (
        <View style={[styles.progressBar, { backgroundColor: '#D1FAE5' }]}>
          <Text style={[styles.progressText, { color: '#065F46' }]}>✅ You've unlocked FREE shipping!</Text>
        </View>
      )}

      <FlatList
        data={cart}
        keyExtractor={(item) => `${item.id}-${item.size}-${item.color}`}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image || item.images?.[0] }} style={styles.cartItemImg} resizeMode="cover" />
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName} numberOfLines={2}>{item.name}</Text>
              <View style={styles.cartItemMeta}>
                <View style={styles.metaChip}><Text style={styles.metaChipText}>{item.size}</Text></View>
                <View style={[styles.metaChip, { backgroundColor: item.color || '#ddd' }]}>
                  <Text style={styles.metaChipText}> </Text>
                </View>
              </View>
              <Text style={styles.cartItemPrice}>{formatPrice(item.price)}</Text>
              <View style={styles.qtyControl}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.size, item.color, -1)}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyVal}>{item.qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.size, item.color, 1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item)}>
                  <Text style={styles.removeBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Order Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryVal}>{formatPrice(cartTotal)}</Text></View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={[styles.summaryVal, shipping === 0 && { color: '#10B981' }]}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</Text>
        </View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax (18% GST)</Text><Text style={styles.summaryVal}>{formatPrice(tax)}</Text></View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalVal}>{formatPrice(total)}</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Checkout')}>
          <LinearGradient colors={['#E94560', '#C73652']} style={styles.checkoutBtn}>
            <Text style={styles.checkoutBtnText}>PROCEED TO CHECKOUT</Text>
            <Text style={styles.checkoutBtnAmount}>{formatPrice(total)}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F9F7F4' },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 52, backgroundColor: '#1a1a2e' },
  back:            { color: '#FFF', fontSize: 22, fontWeight: '300' },
  headerTitle:     { color: '#FFF', fontSize: 17, fontWeight: '700' },
  emptyContainer:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emptyIcon:       { fontSize: 64 },
  emptyTitle:      { fontSize: 22, fontWeight: '700', color: '#1a1a2e' },
  emptySub:        { fontSize: 14, color: '#888', textAlign: 'center' },
  shopBtn:         { marginTop: 8, backgroundColor: '#E94560', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12 },
  shopBtnText:     { color: '#FFF', fontWeight: '700', fontSize: 14 },
  progressBar:     { backgroundColor: '#FEF3C7', padding: 12, paddingHorizontal: 16 },
  progressText:    { fontSize: 12, color: '#92400E', fontWeight: '600', marginBottom: 6 },
  progressTrack:   { height: 4, backgroundColor: '#FDE68A', borderRadius: 2, overflow: 'hidden' },
  progressFill:    { height: '100%', backgroundColor: '#E94560', borderRadius: 2 },
  cartItem:        { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', gap: 12, padding: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6 },
  cartItemImg:     { width: 90, height: 110, borderRadius: 12, backgroundColor: '#F5F5F5' },
  cartItemInfo:    { flex: 1, paddingVertical: 8, paddingRight: 8 },
  cartItemName:    { fontSize: 13, fontWeight: '600', color: '#1a1a2e', lineHeight: 18 },
  cartItemMeta:    { flexDirection: 'row', gap: 6, marginVertical: 4 },
  metaChip:        { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#F0F0F0', borderRadius: 10 },
  metaChipText:    { fontSize: 10, color: '#666', fontWeight: '600' },
  cartItemPrice:   { fontSize: 15, fontWeight: '700', color: '#E94560', marginTop: 2 },
  qtyControl:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  qtyBtn:          { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText:      { fontSize: 16, color: '#444', fontWeight: '300' },
  qtyVal:          { fontSize: 15, fontWeight: '700', color: '#1a1a2e', minWidth: 20, textAlign: 'center' },
  removeBtn:       { marginLeft: 'auto' },
  removeBtnText:   { fontSize: 16 },
  summary:         { backgroundColor: '#FFF', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 16 },
  summaryRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel:    { fontSize: 13, color: '#666' },
  summaryVal:      { fontSize: 13, fontWeight: '600', color: '#333' },
  summaryTotal:    { borderTopWidth: 1, borderColor: '#F0F0F0', paddingTop: 10, marginTop: 4, marginBottom: 14 },
  totalLabel:      { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  totalVal:        { fontSize: 18, fontWeight: '800', color: '#E94560' },
  checkoutBtn:     { borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkoutBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  checkoutBtnAmount: { color: '#FFF', fontWeight: '800', fontSize: 16 },
});

export default CartScreen;
