import React, { useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  StyleSheet, Dimensions, StatusBar, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useStore from '../store/useStore';
import { COLORS, formatPrice, getDiscount } from '../utils/theme';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const images = product.images || [product.image];
  const sizes = product.sizes || ['XS','S','M','L','XL','XXL'];
  const colors = product.colors || ['#000000','#E94560','#FFFFFF'];
  const discount = getDiscount(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart({ ...product, image: images[0] }, selectedSize, colors[selectedColor]);
    Alert.alert('Added to Cart! 🛒', `${product.name} has been added to your cart.`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>←</Text>
      </TouchableOpacity>

      {/* Wishlist button */}
      <TouchableOpacity style={styles.wishlistBtn} onPress={() => toggleWishlist(product)}>
        <Text style={{ fontSize: 20 }}>{wishlisted ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: images[activeImg] }} style={styles.mainImage} resizeMode="cover" />
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>

        {/* Thumbnails */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnails} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {images.map((img, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveImg(i)}
              style={[styles.thumbnail, i === activeImg && styles.thumbnailActive]}>
              <Image source={{ uri: img }} style={styles.thumbnailImg} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.info}>
          {/* Category & Name */}
          <Text style={styles.category}>{product.category?.toUpperCase()}</Text>
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1,2,3,4,5].map(s => (
                <Text key={s} style={{ fontSize: 14, color: s <= Math.floor(product.rating) ? '#F59E0B' : '#DDD' }}>★</Text>
              ))}
            </View>
            <Text style={styles.ratingText}>{product.rating} ({product.reviews?.toLocaleString()} reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
            {discount > 0 && (
              <View style={styles.savingBadge}>
                <Text style={styles.savingText}>{discount}% OFF</Text>
              </View>
            )}
          </View>

          {/* Color Selection */}
          <Text style={styles.sectionLabel}>Color: <Text style={styles.selectedValue}>{colors[selectedColor]}</Text></Text>
          <View style={styles.colorsRow}>
            {colors.map((color, i) => (
              <TouchableOpacity key={i} onPress={() => setSelectedColor(i)}
                style={[styles.colorDot, { backgroundColor: color }, i === selectedColor && styles.colorDotActive]} />
            ))}
          </View>

          {/* Size Selection */}
          <Text style={styles.sectionLabel}>Size: <Text style={styles.selectedValue}>{selectedSize}</Text></Text>
          <View style={styles.sizesRow}>
            {sizes.map((size) => (
              <TouchableOpacity key={size} onPress={() => setSelectedSize(size)}
                style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}>
                <Text style={[styles.sizeBtnText, selectedSize === size && styles.sizeBtnTextActive]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity */}
          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{qty}</Text>
            <TouchableOpacity onPress={() => setQty(qty + 1)} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {['description', 'details', 'reviews'].map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.tabActive]}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'description' && (
            <Text style={styles.descText}>{product.description || 'Premium quality product crafted with the finest materials. Perfect for any occasion.'}</Text>
          )}
          {activeTab === 'details' && (
            <View style={styles.detailsTable}>
              {[['Category', product.category], ['Available Sizes', sizes.join(', ')], ['Rating', `${product.rating}/5`], ['Reviews', product.reviews?.toLocaleString()]].map(([k, v]) => (
                <View key={k} style={styles.detailRow}>
                  <Text style={styles.detailKey}>{k}</Text>
                  <Text style={styles.detailVal}>{v}</Text>
                </View>
              ))}
            </View>
          )}
          {activeTab === 'reviews' && (
            <View style={styles.reviewsPlaceholder}>
              <Text style={styles.reviewsBig}>{product.rating}</Text>
              <View style={styles.stars}>
                {[1,2,3,4,5].map(s => <Text key={s} style={{ fontSize: 20, color: s <= product.rating ? '#F59E0B' : '#DDD' }}>★</Text>)}
              </View>
              <Text style={styles.reviewsCount}>{product.reviews?.toLocaleString()} verified reviews</Text>
            </View>
          )}

          {/* Guarantees */}
          <View style={styles.guarantees}>
            {[['🔄','Easy Returns'],['🔒','Secure Pay'],['✅','Authentic']].map(([icon, label]) => (
              <View key={label} style={styles.guaranteeItem}>
                <Text style={{ fontSize: 18 }}>{icon}</Text>
                <Text style={styles.guaranteeLabel}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.wishlistBarBtn} onPress={() => toggleWishlist(product)}>
          <Text style={{ fontSize: 22 }}>{wishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartBarBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartBarText}>ADD TO CART</Text>
        </TouchableOpacity>
        <LinearGradient colors={['#E94560','#C73652']} style={styles.buyNowBtn}>
          <TouchableOpacity onPress={() => { addToCart({...product}, selectedSize, colors[selectedColor]); navigation.navigate('Cart'); }}>
            <Text style={styles.buyNowText}>BUY NOW</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#FFF' },
  backBtn:           { position: 'absolute', top: 52, left: 16, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backBtnText:       { color: '#FFF', fontSize: 20, fontWeight: '300' },
  wishlistBtn:       { position: 'absolute', top: 52, right: 16, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  imageContainer:    { position: 'relative' },
  mainImage:         { width, height: width * 1.1, backgroundColor: '#F5F5F5' },
  discountBadge:     { position: 'absolute', top: 60, left: 16, backgroundColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  discountText:      { color: '#FFF', fontWeight: '700', fontSize: 12 },
  thumbnails:        { marginVertical: 12 },
  thumbnail:         { width: 60, height: 72, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  thumbnailActive:   { borderColor: '#E94560' },
  thumbnailImg:      { width: '100%', height: '100%' },
  info:              { paddingHorizontal: 16, paddingTop: 4 },
  category:          { color: '#E94560', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  name:              { fontSize: 22, fontWeight: '800', color: '#1a1a2e', lineHeight: 28 },
  ratingRow:         { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 },
  stars:             { flexDirection: 'row', gap: 2 },
  ratingText:        { color: '#666', fontSize: 12 },
  priceRow:          { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F0F0F0', marginBottom: 16 },
  price:             { fontSize: 26, fontWeight: '800', color: '#E94560' },
  originalPrice:     { fontSize: 16, color: '#AAA', textDecorationLine: 'line-through' },
  savingBadge:       { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  savingText:        { color: '#065F46', fontWeight: '700', fontSize: 12 },
  sectionLabel:      { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 6 },
  selectedValue:     { color: '#E94560' },
  colorsRow:         { flexDirection: 'row', gap: 10, marginBottom: 16 },
  colorDot:          { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: 'transparent' },
  colorDotActive:    { borderColor: '#E94560', transform: [{ scale: 1.2 }] },
  sizesRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  sizeBtn:           { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: '#DDD' },
  sizeBtnActive:     { borderColor: '#1a1a2e', backgroundColor: '#1a1a2e' },
  sizeBtnText:       { fontSize: 12, color: '#666', fontWeight: '600' },
  sizeBtnTextActive: { color: '#FFF' },
  qtyRow:            { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  qtyBtn:            { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText:        { fontSize: 20, color: '#333', fontWeight: '300' },
  qtyValue:          { fontSize: 18, fontWeight: '700', color: '#1a1a2e', minWidth: 24, textAlign: 'center' },
  tabs:              { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#F0F0F0', marginBottom: 14 },
  tab:               { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderColor: 'transparent' },
  tabActive:         { borderColor: '#E94560' },
  tabText:           { fontSize: 13, color: '#999', fontWeight: '600' },
  tabTextActive:     { color: '#E94560' },
  descText:          { fontSize: 14, lineHeight: 22, color: '#555', marginBottom: 16 },
  detailsTable:      { gap: 10, marginBottom: 16 },
  detailRow:         { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#F5F5F5' },
  detailKey:         { fontSize: 13, color: '#666', fontWeight: '600' },
  detailVal:         { fontSize: 13, color: '#333', textTransform: 'capitalize' },
  reviewsPlaceholder:{ alignItems: 'center', padding: 20, gap: 8 },
  reviewsBig:        { fontSize: 48, fontWeight: '800', color: '#1a1a2e' },
  reviewsCount:      { fontSize: 13, color: '#888' },
  guarantees:        { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, backgroundColor: '#F9F7F4', borderRadius: 16, marginVertical: 16 },
  guaranteeItem:     { alignItems: 'center', gap: 4 },
  guaranteeLabel:    { fontSize: 11, color: '#555', fontWeight: '600' },
  bottomBar:         { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, paddingBottom: 28, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 10 },
  wishlistBarBtn:    { width: 46, height: 46, borderRadius: 12, borderWidth: 1.5, borderColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  addToCartBarBtn:   { flex: 1, height: 46, borderRadius: 12, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center' },
  addToCartBarText:  { color: '#FFF', fontWeight: '700', fontSize: 12, letterSpacing: 1 },
  buyNowBtn:         { flex: 1, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buyNowText:        { color: '#FFF', fontWeight: '700', fontSize: 12, letterSpacing: 1 },
});

export default ProductDetailScreen;
