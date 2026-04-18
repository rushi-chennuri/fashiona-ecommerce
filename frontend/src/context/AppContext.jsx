import { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([
    {
      id: 1, name: "Silk Embroidered Saree", price: 4999, qty: 1,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop",
      size: "Free", color: "Red"
    }
  ]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);

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

  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        addToast(`Removed from wishlist`, "info");
        return prev.filter(i => i.id !== product.id);
      }
      addToast(`Added to wishlist ❤️`, "success");
      return [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback((id) => wishlist.some(i => i.id === id), [wishlist]);

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
      user, setUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
