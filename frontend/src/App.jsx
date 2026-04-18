import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import SearchModal from "./components/SearchModal";
import ToastContainer from "./components/ToastContainer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import AccountPage from "./pages/AccountPage";
import "./index.css";

const AppInner = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const noLayoutPages = ["checkout"];
  const showLayout = !noLayoutPages.includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} />;
      case "products":
        return <ProductsPage setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} />;
      case "product-detail":
        return <ProductDetailPage product={selectedProduct} setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} />;
      case "checkout":
        return <CheckoutPage setCurrentPage={setCurrentPage} />;
      case "wishlist":
        return <WishlistPage setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} />;
      case "account":
        return <AccountPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {showLayout && <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />}

      <main className="flex-1">
        {renderPage()}
      </main>

      {showLayout && <Footer setCurrentPage={setCurrentPage} />}

      <CartDrawer setCurrentPage={setCurrentPage} />
      <SearchModal setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
