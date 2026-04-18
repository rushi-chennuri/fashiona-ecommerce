import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create((set, get) => ({
  // ─── AUTH ───────────────────────────────
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    set({ token });
    AsyncStorage.setItem('auth_token', token);
  },
  logout: () => {
    set({ user: null, token: null, cart: [], wishlist: [] });
    AsyncStorage.removeItem('auth_token');
  },
  initAuth: async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) set({ token });
  },

  // ─── CART ───────────────────────────────
  cart: [],
  addToCart: (product, size = 'M', color = '#000') => {
    const existing = get().cart.find(
      (i) => i.id === product.id && i.size === size && i.color === color
    );
    if (existing) {
      set((s) => ({
        cart: s.cart.map((i) =>
          i.id === product.id && i.size === size && i.color === color
            ? { ...i, qty: i.qty + 1 }
            : i
        ),
      }));
    } else {
      set((s) => ({ cart: [...s.cart, { ...product, qty: 1, size, color }] }));
    }
  },
  removeFromCart: (id, size, color) =>
    set((s) => ({
      cart: s.cart.filter(
        (i) => !(i.id === id && i.size === size && i.color === color)
      ),
    })),
  updateQty: (id, size, color, delta) =>
    set((s) => ({
      cart: s.cart
        .map((i) =>
          i.id === id && i.size === size && i.color === color
            ? { ...i, qty: i.qty + delta }
            : i
        )
        .filter((i) => i.qty > 0),
    })),
  clearCart: () => set({ cart: [] }),
  get cartTotal() {
    return get().cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  get cartCount() {
    return get().cart.reduce((sum, i) => sum + i.qty, 0);
  },

  // ─── WISHLIST ────────────────────────────
  wishlist: [],
  toggleWishlist: (product) => {
    const exists = get().wishlist.find((i) => i.id === product.id);
    set((s) => ({
      wishlist: exists
        ? s.wishlist.filter((i) => i.id !== product.id)
        : [...s.wishlist, product],
    }));
  },
  isWishlisted: (id) => get().wishlist.some((i) => i.id === id),

  // ─── SEARCH ──────────────────────────────
  recentSearches: [],
  addRecentSearch: (query) =>
    set((s) => ({
      recentSearches: [
        query,
        ...s.recentSearches.filter((q) => q !== query),
      ].slice(0, 10),
    })),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));

export default useStore;
