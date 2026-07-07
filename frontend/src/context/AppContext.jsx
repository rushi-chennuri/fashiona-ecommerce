import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AppContext = createContext(null);

const API = import.meta.env.VITE_API_URL || "/api";

export const AppProvider = ({ children }) => {
  const [cart, setCart]           = useState([]);
  const [wishlist, setWishlist]   = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [toasts, setToasts]       = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser]           = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // checking stored session

  // ── Restore session on first load ──────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("fashiona_token");
    if (!token) { setAuthLoading(false); return; }
    fetch(`${API}/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => {
        setUser({
          name:   `${data.firstName || ""} ${data.lastName || ""}`.trim() || data.email,
          email:  data.email,
          avatar: (data.firstName?.[0] || data.email?.[0] || "U").toUpperCase(),
        });
      })
      .catch(() => localStorage.removeItem("fashiona_token"))
      .finally(() => setAuthLoading(false));
  }, []);

  // ── Auth helpers ────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Invalid email or password");
    }
    const data = await res.json();
    localStorage.setItem("fashiona_token", data.token);
    const displayName =
      data.user
        ? `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim() || email
        : email.split("@")[0];
    setUser({
      name:   displayName,
      email:  data.user?.email || email,
      avatar: displayName[0].toUpperCase(),
    });
    return data;
  }, []);

  const register = useCallback(async (firstName, lastName, email, password) => {
    const res = await fetch(`${API}/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Registration failed. Email may already be in use.");
    }
    const data = await res.json();
    localStorage.setItem("fashiona_token", data.token);
    const displayName = `${firstName} ${lastName}`.trim();
    setUser({
      name:   displayName,
      email,
      avatar: firstName[0].toUpperCase(),
    });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fashiona_token");
    setUser(null);
    addToast("You've been signed out.", "info");
  }, []);

  // ── Cart helpers ────────────────────────────────────────────
  const addToCart = useCallback((product, size = "M", color = "Default") => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id && i.size === size && i.color === color);
      if (exists) return prev.map(i =>
        i.id === product.id && i.size === size && i.color === color
          ? { ...i, qty: i.qty + 1 } : i
      );
      return [...prev, { ...product, qty: 1, size, color }];
    });
    addToast(`${product.name} added to cart!`, "success");
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id, size, color) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.size === size && i.color === color)));
  }, []);

  const updateQty = useCallback((id, size, color, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id && i.size === size && i.color === color) {
        const newQty = i.qty + delta;
        return newQty <= 0 ? null : { ...i, qty: newQty };
      }
      return i;
    }).filter(Boolean));
  }, []);

  // ── Wishlist ────────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        addToast("Removed from wishlist", "info");
        return prev.filter(i => i.id !== product.id);
      }
      addToast("Added to wishlist ❤️", "success");
      return [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback((id) => wishlist.some(i => i.id === id), [wishlist]);

  // ── Toasts ──────────────────────────────────────────────────
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <AppContext.Provider value={{
      cart, cartOpen, setCartOpen, cartTotal, cartCount,
      addToCart, removeFromCart, updateQty,
      wishlist, toggleWishlist, isWishlisted,
      toasts, addToast,
      searchOpen, setSearchOpen,
      user, setUser, login, register, logout, authLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
