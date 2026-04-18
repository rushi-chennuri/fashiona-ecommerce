import { useApp } from "../context/AppContext";
import { formatPrice, getDiscount, getBadgeStyle } from "../data/products";

const WishlistPage = ({ setCurrentPage, setSelectedProduct }) => {
  const { wishlist, toggleWishlist, addToCart } = useApp();

  if (wishlist.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-28 h-28 bg-rose-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-14 h-14 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h2 className="font-display text-3xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h2>
      <p className="text-gray-500 mb-8 max-w-sm">Save your favourite items and come back to them anytime. Start exploring now!</p>
      <button onClick={() => setCurrentPage("products")}
        className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm tracking-wide">
        Explore Collections
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 to-purple-900 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-white mb-2">My Wishlist</h1>
          <p className="text-gray-300">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {wishlist.map(product => {
            const discount = getDiscount(product.price, product.originalPrice);
            return (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 cursor-pointer"
                  onClick={() => { setSelectedProduct(product); setCurrentPage("product-detail"); }}>
                  <img src={product.images[0]} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => e.target.src = "https://via.placeholder.com/300x400?text=Fashion"} />

                  {product.badge && (
                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${getBadgeStyle(product.badge)}`}>
                      {product.badge === "sale" ? `-${discount}%` : product.badge}
                    </span>
                  )}

                  {/* Remove from wishlist */}
                  <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-rose-50 transition-colors">
                    <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </button>

                  {/* Quick add */}
                  <div className="absolute bottom-0 inset-x-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product, product.sizes[0], product.colors[0]); }}
                      className="w-full py-2.5 bg-gray-900 text-white text-xs font-bold tracking-wider flex items-center justify-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-rose-600 text-sm">{formatPrice(product.price)}</span>
                    {discount > 0 && <span className="text-green-600 text-xs font-semibold">{discount}% off</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Move all to cart */}
        <div className="mt-10 flex justify-center">
          <button onClick={() => { wishlist.forEach(p => addToCart(p, p.sizes[0], p.colors[0])); }}
            className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Move All to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
