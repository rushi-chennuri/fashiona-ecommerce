import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { cartCount, setCartOpen, wishlist, setSearchOpen, user } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Women", page: "products", sub: ["Sarees","Dresses","Kurtas","Blouses","Lehengas"] },
    { label: "Men", page: "products", sub: ["Kurtas","Shirts","Trousers","Sherwanis","Suits"] },
    { label: "Footwear", page: "products", sub: ["Heels","Sneakers","Juttis","Sandals","Slippers"] },
    { label: "Accessories", page: "products", sub: ["Watches","Caps","Bags","Jewelry","Sunglasses"] },
    { label: "Sale 🔥", page: "products", special: true },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs py-2 text-center font-medium tracking-wide">
        🚚 FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;|&nbsp; USE CODE: <span className="font-bold underline cursor-pointer">FASHION20</span> FOR 20% OFF
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-glass shadow-2xl" : "bg-gray-900"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage("home")}>
              <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center shadow-lg">
                <span className="text-gray-900 font-bold text-lg font-display">F</span>
              </div>
              <div>
                <div className="font-display font-bold text-white text-xl tracking-tight">FASHIONA</div>
                <div className="text-amber-400 text-[9px] tracking-[4px] -mt-1 font-medium">PREMIUM FASHION</div>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group"
                  onMouseEnter={() => setActiveMenu(link.label)}
                  onMouseLeave={() => setActiveMenu(null)}>
                  <button
                    onClick={() => setCurrentPage(link.page)}
                    className={`px-4 py-5 text-sm font-medium transition-colors flex items-center gap-1 ${
                      link.special
                        ? "text-amber-400 font-bold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {link.sub && (
                      <svg className="w-3.5 h-3.5 mt-0.5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
                  </button>

                  {/* Dropdown */}
                  {link.sub && (
                    <div className={`absolute top-full left-0 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 ${
                      activeMenu === link.label ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                    } transition-all duration-200`}>
                      {link.sub.map(sub => (
                        <button key={sub} onClick={() => setCurrentPage("products")}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 hover:pl-6 transition-all duration-200">
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist */}
              <button onClick={() => setCurrentPage("wishlist")}
                className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all relative">
                <svg className="w-5 h-5" fill={wishlist.length > 0 ? "#e94560" : "none"} viewBox="0 0 24 24" stroke={wishlist.length > 0 ? "#e94560" : "currentColor"}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button onClick={() => setCartOpen(true)}
                className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all relative">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User */}
              <button onClick={() => setCurrentPage("account")}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user ? user.name.split(" ")[0] : "Login"}
              </button>

              {/* Mobile menu */}
              <button onClick={() => setMobileMenu(!mobileMenu)}
                className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-300">
                <div className="space-y-1.5">
                  <span className={`block h-0.5 bg-current transition-all ${mobileMenu ? "w-5 rotate-45 translate-y-2" : "w-5"}`}></span>
                  <span className={`block h-0.5 bg-current transition-all ${mobileMenu ? "opacity-0" : "w-4"}`}></span>
                  <span className={`block h-0.5 bg-current transition-all ${mobileMenu ? "w-5 -rotate-45 -translate-y-2" : "w-5"}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="lg:hidden bg-gray-900 border-t border-gray-800 py-4 px-6">
            {navLinks.map(link => (
              <button key={link.label} onClick={() => { setCurrentPage(link.page); setMobileMenu(false); }}
                className={`block w-full text-left py-3 border-b border-gray-800 text-sm font-medium ${
                  link.special ? "text-amber-400" : "text-gray-300"
                }`}>
                {link.label}
              </button>
            ))}
            <button onClick={() => setCurrentPage("account")}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg text-sm font-medium">
              Login / Register
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
