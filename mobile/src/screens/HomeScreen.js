import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  FlatList, StyleSheet, Dimensions, StatusBar,
  TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useStore from '../store/useStore';
import { COLORS, FONTS, SIZES, formatPrice } from '../utils/theme';

const { width } = Dimensions.get('window');

const BANNER_SLIDES = [
  {
    id: '1', title: 'New Collection\n2024', sub: 'Up to 60% Off',
    colors: ['#1a1a2e', '#0f3460'], tag: '🔥 TRENDING',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop',
  },
  {
    id: '2', title: 'Wedding\nSpecials', sub: 'Bridal Collection',
    colors: ['#4a0014', '#8b0026'], tag: '💍 BRIDAL',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
  },
  {
    id: '3', title: 'Footwear\nFiesta', sub: 'Flat 40% Off',
    colors: ['#0d2137', '#1a4a6e'], tag: '👠 SHOES',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop',
  },
];

const CATEGORIES = [
  { id: 'c1', name: 'Sarees',    icon: '🥻', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=240&fit=crop' },
  { id: 'c2', name: 'Dresses',   icon: '👗', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=240&fit=crop' },
  { id: 'c3', name: 'Shoes',     icon: '👠', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=240&fit=crop' },
  { id: 'c4', name: 'Watches',   icon: '⌚', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=240&fit=crop' },
  { id: 'c5', name: 'Caps',      icon: '🧢', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&h=240&fit=crop' },
  { id: 'c6', name: 'Slippers',  icon: '🩴', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=240&fit=crop' },
];

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Kanjivaram Silk Saree', price: 8999, originalPrice: 12999, rating: 4.8, reviews: 312, badge: 'bestseller', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=380&fit=crop', category: 'sarees' },
  { id: 'p2', name: 'Floral Maxi Dress',     price: 2499, originalPrice: 3999,  rating: 4.7, reviews: 428, badge: 'trending',  image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=380&fit=crop', category: 'dresses' },
  { id: 'p3', name: 'Block Heel Sandals',    price: 3299, originalPrice: 4999,  rating: 4.6, reviews: 321, badge: 'sale',      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=380&fit=crop', category: 'shoes' },
  { id: 'p4', name: 'Rose Gold Watch',       price: 12999,originalPrice: 18999, rating: 4.9, reviews: 89,  badge: 'luxury',   image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=380&fit=crop', category: 'watches' },
  { id: 'p5', name: 'Baseball Cap',          price: 799,  originalPrice: 1299,  rating: 4.4, reviews: 312, badge: 'sale',      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=380&fit=crop', category: 'caps' },
  { id: 'p6', name: 'Diamond Slide Slippers',price: 999,  originalPrice: 1599,  rating: 4.3, reviews: 234, badge: 'new',       image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=380&fit=crop', category: 'slippers' },
];

const StarRating = ({ rating }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {[1,2,3,4,5].map(s => (
      <Text key={s} style={{ fontSize: 10, color: s <= Math.floor(rating) ? '#F59E0B' : '#DDD' }}>★</Text>
    ))}
  </View>
);

const ProductCard = ({ product, navigation }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product })}
      activeOpacity={0.92}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
        {product.badge && (
          <View style={[styles.badge, { backgroundColor: product.badge === 'sale' ? '#EF4444' : product.badge === 'new' ? '#10B981' : product.badge === 'luxury' ? '#D97706' : '#8B5CF6' }]}>
            <Text style={styles.badgeText}>{product.badge === 'sale' ? `-${discount}%` : product.badge.toUpperCase()}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(product)}
        >
          <Text style={{ fontSize: 16 }}>{isWishlisted(product.id) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <StarRating rating={product.rating} />
        <Text style={styles.reviewCount}>({product.reviews})</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
        </View>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => addToCart(product)}
        >
          <Text style={styles.addToCartText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('trending');
  const [refreshing, setRefreshing] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (bannerIndex + 1) % BANNER_SLIDES.length;
      setBannerIndex(next);
      bannerRef.current?.scrollToIndex({ index: next, animated: true });
    }, 4000);
    return () => clearInterval(timer);
  }, [bannerIndex]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <LinearGradient colors={[COLORS.primary, '#16213e']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerBrand}>FASHIONA</Text>
            <Text style={styles.headerSub}>PREMIUM FASHION</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.headerIcon}>
              <Text style={{ fontSize: 20 }}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.headerIcon}>
              <Text style={{ fontSize: 20 }}>🛒</Text>
              {useStore.getState().cart.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{useStore.getState().cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
      >
        {/* Hero Banner Carousel */}
        <FlatList
          ref={bannerRef}
          data={BANNER_SLIDES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            setBannerIndex(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item }) => (
            <LinearGradient colors={item.colors} style={[styles.bannerSlide, { width }]}>
              <View style={styles.bannerContent}>
                <View style={styles.bannerLeft}>
                  <View style={styles.bannerTag}>
                    <Text style={styles.bannerTagText}>{item.tag}</Text>
                  </View>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSub}>{item.sub}</Text>
                  <TouchableOpacity
                    style={styles.bannerBtn}
                    onPress={() => navigation.navigate('Products')}
                  >
                    <Text style={styles.bannerBtnText}>Shop Now →</Text>
                  </TouchableOpacity>
                </View>
                <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
              </View>
            </LinearGradient>
          )}
        />

        {/* Dots */}
        <View style={styles.dots}>
          {BANNER_SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === bannerIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Trust Bar */}
        <View style={styles.trustBar}>
          {[['🚚','Free Delivery'],['🔄','Easy Returns'],['🔒','Secure Pay'],['💎','Authentic']].map(([icon, label]) => (
            <View key={label} style={styles.trustItem}>
              <Text style={styles.trustIcon}>{icon}</Text>
              <Text style={styles.trustLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Products', { category: item.name.toLowerCase() })}
              >
                <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={styles.categoryGradient}>
                  <Text style={styles.categoryIcon}>{item.icon}</Text>
                  <Text style={styles.categoryName}>{item.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
            {['trending','new','sale','bestseller'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={MOCK_PRODUCTS}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            renderItem={({ item }) => <ProductCard product={item} navigation={navigation} />}
          />
        </View>

        {/* Promo Banner */}
        <TouchableOpacity style={styles.promoBanner} onPress={() => navigation.navigate('Products')}>
          <LinearGradient colors={['#e94560', '#c73652']} style={styles.promoBannerGradient}>
            <View>
              <Text style={styles.promoText}>🎉 USE CODE: FASHION20</Text>
              <Text style={styles.promoSub}>Get 20% off on your first order!</Text>
            </View>
            <Text style={styles.promoArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#F9F7F4' },
  header:            { paddingTop: 44, paddingBottom: 12, paddingHorizontal: 16 },
  headerContent:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBrand:       { color: '#FFF', fontWeight: '800', fontSize: 22, letterSpacing: 2 },
  headerSub:         { color: '#D4AF37', fontSize: 8, letterSpacing: 4, marginTop: -2 },
  headerIcons:       { flexDirection: 'row', gap: 8 },
  headerIcon:        { padding: 8, position: 'relative' },
  cartBadge:         { position: 'absolute', top: 4, right: 4, backgroundColor: '#EF4444', borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText:     { color: '#FFF', fontSize: 9, fontWeight: '700' },

  bannerSlide:       { height: 220, paddingHorizontal: 20, paddingVertical: 24, justifyContent: 'center' },
  bannerContent:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerLeft:        { flex: 1 },
  bannerTag:         { backgroundColor: '#D4AF37', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 8 },
  bannerTagText:     { color: '#1a1a2e', fontSize: 10, fontWeight: '700' },
  bannerTitle:       { color: '#FFF', fontSize: 24, fontWeight: '800', lineHeight: 30, marginBottom: 6 },
  bannerSub:         { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 14 },
  bannerBtn:         { backgroundColor: '#E94560', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  bannerBtnText:     { color: '#FFF', fontWeight: '700', fontSize: 13 },
  bannerImage:       { width: 110, height: 160, borderRadius: 16, marginLeft: 12 },

  dots:              { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  dot:               { width: 6, height: 6, borderRadius: 3, backgroundColor: '#DDD' },
  dotActive:         { width: 20, backgroundColor: '#E94560' },

  trustBar:          { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  trustItem:         { flex: 1, alignItems: 'center', gap: 4 },
  trustIcon:         { fontSize: 18 },
  trustLabel:        { fontSize: 10, color: '#555', fontWeight: '600', textAlign: 'center' },

  section:           { marginTop: 20 },
  sectionHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle:      { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  seeAll:            { fontSize: 13, color: '#E94560', fontWeight: '600' },

  categoryCard:      { width: 100, height: 130, borderRadius: 14, overflow: 'hidden', marginRight: 10 },
  categoryImage:     { width: '100%', height: '100%', position: 'absolute' },
  categoryGradient:  { flex: 1, justifyContent: 'flex-end', padding: 8 },
  categoryIcon:      { fontSize: 18 },
  categoryName:      { color: '#FFF', fontWeight: '700', fontSize: 12, marginTop: 2 },

  tabContainer:      { paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  tab:               { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F0F0F0' },
  tabActive:         { backgroundColor: '#1a1a2e' },
  tabText:           { fontSize: 12, color: '#666', fontWeight: '600' },
  tabTextActive:     { color: '#FFF' },

  productCard:       { flex: 1, margin: 5, backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  productImageContainer: { position: 'relative' },
  productImage:      { width: '100%', aspectRatio: 0.78, backgroundColor: '#F5F5F5' },
  badge:             { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeText:         { color: '#FFF', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  wishlistBtn:       { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  productInfo:       { padding: 10 },
  productName:       { fontSize: 12, fontWeight: '600', color: '#1a1a2e', marginBottom: 3 },
  reviewCount:       { fontSize: 10, color: '#999', marginLeft: 2 },
  priceRow:          { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 8 },
  price:             { fontSize: 14, fontWeight: '700', color: '#E94560' },
  originalPrice:     { fontSize: 11, color: '#AAA', textDecorationLine: 'line-through' },
  addToCartBtn:      { backgroundColor: '#1a1a2e', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  addToCartText:     { color: '#FFF', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  promoBanner:       { marginHorizontal: 16, marginTop: 20, borderRadius: 16, overflow: 'hidden' },
  promoBannerGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  promoText:         { color: '#FFF', fontWeight: '800', fontSize: 15 },
  promoSub:          { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 3 },
  promoArrow:        { color: '#FFF', fontSize: 28, fontWeight: '200' },
});

export default HomeScreen;
