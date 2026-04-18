import { useState } from "react";
import { useApp } from "../context/AppContext";
import { formatPrice, getDiscount, getBadgeStyle } from "../data/products";

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(rating) ? "text-amber-400" : s - 0.5 <= rating ? "text-amber-400" : "text-gray-300"}`}
        fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);

const ProductCard = ({ product, setCurrentPage, setSelectedProduct }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const discount = getDiscount(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);

  return (
    <div
      className="product-card bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setImgIdx(0); }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100"
        onClick={() => { setSelectedProduct(product); setCurrentPage("product-detail"); }}>

        <img
          src={product.images[hovered && product.images[1] ? 1 : 0]}
          alt={product.name}
          className="product-img w-full h-full object-cover"
          onError={e => e.target.src = "https://via.placeholder.com/300x400?text=Fashion"}
        />

        {/* Overlay */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}></div>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getBadgeStyle(product.badge)}`}>
            {product.badge === "sale" ? `-${discount}%` : product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg className="w-4 h-4" fill={wishlisted ? "#e94560" : "none"} viewBox="0 0 24 24" stroke={wishlisted ? "#e94560" : "#666"} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick add button */}
        <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product, product.sizes[0], product.colors[0]); }}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:from-rose-700 hover:to-pink-700"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Add to Cart
          </button>
        </div>

        {/* Stock warning */}
        {product.stock <= 10 && (
          <div className="absolute bottom-12 left-0 right-0 bg-amber-500/90 text-white text-xs py-1 text-center font-medium">
            Only {product.stock} left!
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3" onClick={() => { setSelectedProduct(product); setCurrentPage("product-detail"); }}>
        {/* Colors */}
        <div className="flex items-center gap-1.5 mb-2">
          {product.colors.slice(0, 4).map((c, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full border border-gray-200 hover:scale-125 transition-transform cursor-pointer"
              style={{ backgroundColor: c }} title={c}></div>
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-gray-500">+{product.colors.length - 4}</span>
          )}
        </div>

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 hover:text-rose-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-1">
          <StarRating rating={product.rating} />
          <span className="text-[10px] text-gray-500">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</span>
          )}
          {discount > 0 && (
            <span className="text-green-600 text-xs font-semibold">{discount}% off</span>
          )}
        </div>

        {/* Size quick select */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {product.sizes.slice(0, 5).map(s => (
            <span key={s} className="text-[10px] px-1.5 py-0.5 border border-gray-200 rounded text-gray-500 hover:border-rose-400 hover:text-rose-600 cursor-pointer transition-colors">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
