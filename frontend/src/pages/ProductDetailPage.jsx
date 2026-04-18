import { useState } from "react";
import { useApp } from "../context/AppContext";
import { products, formatPrice, getDiscount, getBadgeStyle } from "../data/products";
import ProductCard from "../components/ProductCard";

const ProductDetailPage = ({ product, setCurrentPage, setSelectedProduct }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState("");

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Product not found. <button onClick={() => setCurrentPage("products")} className="text-rose-600 font-medium">Browse Products</button></p>
    </div>
  );

  const discount = getDiscount(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeMsg("✅ Delivery in 2-4 business days");
    } else {
      setPincodeMsg("❌ Please enter a valid 6-digit pincode");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => setCurrentPage("home")} className="hover:text-rose-600 transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => setCurrentPage("products")} className="hover:text-rose-600 transition-colors capitalize">{product.category}</button>
            <span>/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 group">
              <img src={product.images[activeImg]} alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={e => e.target.src = "https://via.placeholder.com/600x750?text=Fashion"} />

              {product.badge && (
                <span className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${getBadgeStyle(product.badge)}`}>
                  {product.badge === "sale" ? `-${discount}%` : product.badge}
                </span>
              )}

              <button onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill={wishlisted ? "#e94560" : "none"} viewBox="0 0 24 24" stroke={wishlisted ? "#e94560" : "#666"} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-rose-500 shadow-lg" : "border-gray-200 hover:border-gray-400"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover"
                    onError={e => e.target.src = "https://via.placeholder.com/80x96"} />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-rose-500 font-medium text-sm uppercase tracking-widest mb-1 capitalize">{product.category}</p>
              <h1 className="font-display text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-4 h-4 ${s <= Math.floor(product.rating) ? "text-amber-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="font-semibold text-gray-700">{product.rating}</span>
                <span className="text-gray-500 text-sm">({product.reviews.toLocaleString()} reviews)</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 10 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  {product.stock > 10 ? "In Stock" : `Only ${product.stock} left!`}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 py-4 border-y border-gray-100">
              <span className="font-display text-3xl font-bold text-rose-600">{formatPrice(product.price)}</span>
              <span className="text-gray-400 text-xl line-through">{formatPrice(product.originalPrice)}</span>
              {discount > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-lg text-sm">{discount}% OFF</span>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <p className="font-semibold text-gray-800 mb-3 text-sm">
                Color: <span className="text-rose-600 font-bold">{product.colors[selectedColor]}</span>
              </p>
              <div className="flex items-center gap-3">
                {product.colors.map((color, i) => (
                  <button key={i} onClick={() => setSelectedColor(i)}
                    className={`w-8 h-8 rounded-full transition-all duration-200 ${selectedColor === i ? "ring-2 ring-offset-2 ring-rose-500 scale-110" : "hover:scale-110"}`}
                    style={{ backgroundColor: color }} title={color}></button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-800 text-sm">
                  Size: <span className="text-rose-600 font-bold">{selectedSize}</span>
                </p>
                <button className="text-xs text-rose-500 underline font-medium">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-semibold text-gray-800 mb-3 text-sm">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg">−</button>
                  <span className="w-12 text-center font-bold text-gray-800">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg">+</button>
                </div>
                <span className="text-gray-400 text-sm">{product.stock} pieces available</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button onClick={() => addToCart({...product}, selectedSize, product.colors[selectedColor])}
                className="flex-1 py-4 btn-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </button>
              <button onClick={() => { addToCart({...product}, selectedSize, product.colors[selectedColor]); setCurrentPage("checkout"); }}
                className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide hover:bg-gray-800 transition-colors">
                Buy Now
              </button>
            </div>

            {/* Delivery Check */}
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                <span>🚚</span> Check Delivery Availability
              </p>
              <div className="flex gap-2">
                <input value={pincode} onChange={e => setPincode(e.target.value.slice(0, 6))}
                  placeholder="Enter 6-digit pincode"
                  className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white" />
                <button onClick={checkPincode} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Check</button>
              </div>
              {pincodeMsg && <p className={`mt-2 text-xs font-medium ${pincodeMsg.includes("✅") ? "text-green-600" : "text-red-500"}`}>{pincodeMsg}</p>}
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🔄", label: "30-day returns" },
                { icon: "🔒", label: "Secure payment" },
                { icon: "✅", label: "Authentic product" },
              ].map(({ icon, label }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <p className="text-xs text-gray-600 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {["description", "specifications", "reviews"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                  activeTab === tab ? "border-rose-500 text-rose-600" : "border-transparent text-gray-500 hover:text-gray-800"
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-gray-800 mb-3">About This Product</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-medium rounded-full capitalize">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Category", product.category],
                    ["Available Sizes", product.sizes.join(", ")],
                    ["Available Colors", `${product.colors.length} colors`],
                    ["Stock", `${product.stock} units`],
                    ["Rating", `${product.rating}/5 (${product.reviews} reviews)`],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-3 font-medium text-gray-700 w-40">{label}</td>
                      <td className="py-3 text-gray-500 capitalize">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="font-display text-5xl font-bold text-gray-900">{product.rating}</div>
                  <div className="flex items-center gap-0.5 mt-1 justify-center">
                    {[1,2,3,4,5].map(s => <svg key={s} className={`w-4 h-4 ${s <= product.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{product.reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-3">{star}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-gray-500 text-sm text-center">Reviews would load from the backend API</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-gray-900">You May Also Like</h2>
              <button onClick={() => setCurrentPage("products")} className="text-rose-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => (
                <ProductCard key={p.id} product={p} setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
