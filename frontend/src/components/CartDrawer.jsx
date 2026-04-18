import { useApp } from "../context/AppContext";
import { formatPrice } from "../data/products";

const CartDrawer = ({ setCurrentPage }) => {
  const { cart, cartOpen, setCartOpen, cartTotal, removeFromCart, updateQty } = useApp();
  const shipping = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shipping;

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-400 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-900 text-white">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="font-bold text-lg font-display">My Cart</span>
            <span className="bg-rose-500 text-white text-xs rounded-full px-2 py-0.5">{cart.length}</span>
          </div>
          <button onClick={() => setCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free shipping progress */}
        {cartTotal < 999 && (
          <div className="bg-amber-50 px-5 py-3 border-b border-amber-100">
            <p className="text-xs text-amber-700 font-medium mb-2">
              Add {formatPrice(999 - cartTotal)} more for FREE shipping! 🚚
            </p>
            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div className="progress-bar h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((cartTotal/999)*100, 100)}%` }}></div>
            </div>
          </div>
        )}
        {cartTotal >= 999 && (
          <div className="bg-green-50 px-5 py-2 border-b border-green-100 flex items-center gap-2">
            <span className="text-green-600 text-sm font-medium">✅ You've unlocked FREE shipping!</span>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium mb-2">Your cart is empty</p>
              <p className="text-gray-400 text-sm mb-6">Add some fabulous items!</p>
              <button onClick={() => { setCartOpen(false); setCurrentPage("products"); }}
                className="px-6 py-2.5 bg-rose-600 text-white rounded-lg font-medium text-sm hover:bg-rose-700 transition-colors">
                Shop Now
              </button>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <img src={item.image || item.images?.[0]} alt={item.name}
                  className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                  onError={e => e.target.src = "https://via.placeholder.com/64x80?text=Item"} />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{item.size}</span>
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: item.color }}></div>
                  </div>
                  <p className="text-sm font-bold text-rose-600 mt-1">{formatPrice(item.price)}</p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, item.size, item.color, -1)}
                        className="qty-btn text-sm font-bold text-gray-600 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-all">−</button>
                      <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.size, item.color, 1)}
                        className="qty-btn text-sm font-bold text-gray-600 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-all">+</button>
                    </div>

                    <button onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-gray-400 hover:text-rose-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
            {/* Coupon */}
            <div className="flex gap-2">
              <input placeholder="Coupon code" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rose-400" />
              <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">Apply</button>
            </div>

            {/* Summary */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span><span className="text-rose-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => { setCartOpen(false); setCurrentPage("checkout"); }}
              className="w-full py-3.5 btn-primary text-white font-bold rounded-xl text-sm tracking-wide flex items-center justify-center gap-2">
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <button onClick={() => { setCartOpen(false); setCurrentPage("products"); }}
              className="w-full py-2.5 border-2 border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:border-gray-300 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
