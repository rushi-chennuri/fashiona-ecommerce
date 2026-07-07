import { useState } from "react";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../data/products";

const CheckoutPage = ({ setCurrentPage }) => {
  const { cart, cartTotal, addToast } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "",
    paymentMethod: "card",
    cardNumber: "", cardExpiry: "", cardCVV: "",
    upiId: "",
  });
  const [ordered, setOrdered] = useState(false);

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOrder = () => {
    addToast("🎉 Order placed successfully!", "success");
    setOrdered(true);
  };

  if (ordered) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl">
        {/* Demo mode reminder on success screen */}
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl flex items-center gap-2">
          <span className="text-base">🛍️</span>
          <span><strong>Demo Mode</strong> — This is a showcase order. No real payment was charged and no goods will be shipped.</span>
        </div>
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h2>
        <p className="text-gray-500 mb-6">This is a demo order flow. In production this would confirm your order and send a tracking email.</p>
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-bold text-gray-800">#FAS{Date.now().toString().slice(-8)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Paid</span>
            <span className="font-bold text-rose-600">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery</span>
            <span className="font-medium text-gray-800">3-5 Business Days</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setCurrentPage("home")} className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-colors">
            Continue Shopping
          </button>
          <button onClick={() => setCurrentPage("account")} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:border-gray-400 transition-colors">
            Track Order
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Mode Banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-6 text-center">
        <span className="text-amber-800 text-sm font-medium">
          🛍️ <strong>Demo Mode</strong> — Checkout flow is fully functional for showcase purposes. No real payments will be processed.
        </span>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => setCurrentPage("home")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <span className="font-display font-bold text-2xl text-gray-900">FASHIONA</span>
          </button>
          {/* Steps */}
          <div className="hidden sm:flex items-center gap-2">
            {[{n:1,label:"Address"},{n:2,label:"Payment"},{n:3,label:"Review"}].map(({n, label}) => (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= n ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-500"}`}>{n}</div>
                <span className={`text-sm font-medium ${step >= n ? "text-gray-800" : "text-gray-400"}`}>{label}</span>
                {n < 3 && <div className={`w-12 h-0.5 ${step > n ? "bg-rose-600" : "bg-gray-200"}`}></div>}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold">1</span>
                Delivery Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["firstName","First Name","text","col-span-1"],
                  ["lastName","Last Name","text","col-span-1"],
                  ["email","Email Address","email","col-span-2"],
                  ["phone","Phone Number","tel","col-span-2"],
                  ["address","Full Address","text","col-span-2"],
                  ["city","City","text","col-span-1"],
                  ["state","State","text","col-span-1"],
                  ["pincode","Pincode","text","col-span-1"],
                ].map(([name, label, type, span]) => (
                  <div key={name} className={span}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">{label}</label>
                    <input name={name} type={type} value={form[name]} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 transition-colors"
                      placeholder={`Enter ${label.toLowerCase()}`} />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)}
                className="mt-6 w-full py-4 btn-primary text-white font-bold rounded-xl text-sm tracking-wide">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold">2</span>
                Payment Method
              </h2>

              {/* Payment Options */}
              <div className="space-y-3 mb-6">
                {[
                  { key: "card", icon: "💳", label: "Credit / Debit Card" },
                  { key: "upi", icon: "📱", label: "UPI Payment" },
                  { key: "cod", icon: "💵", label: "Cash on Delivery" },
                  { key: "netbanking", icon: "🏦", label: "Net Banking" },
                ].map(({ key, icon, label }) => (
                  <label key={key} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.paymentMethod === key ? "border-rose-500 bg-rose-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="paymentMethod" value={key} checked={form.paymentMethod === key} onChange={handleChange} className="accent-rose-500 w-4 h-4" />
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium text-gray-800 text-sm">{label}</span>
                    {key === "cod" && <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">+₹49 fee</span>}
                  </label>
                ))}
              </div>

              {/* Card Details */}
              {form.paymentMethod === "card" && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Card Number</label>
                    <input name="cardNumber" maxLength={19} placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 bg-white font-mono"
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
                        setForm({...form, cardNumber: v});
                      }} value={form.cardNumber} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Expiry</label>
                      <input name="cardExpiry" placeholder="MM/YY" maxLength={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 bg-white font-mono" onChange={handleChange} value={form.cardExpiry} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">CVV</label>
                      <input name="cardCVV" type="password" placeholder="•••" maxLength={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 bg-white font-mono" onChange={handleChange} value={form.cardCVV} />
                    </div>
                  </div>
                </div>
              )}

              {form.paymentMethod === "upi" && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">UPI ID</label>
                  <input name="upiId" placeholder="yourname@upi" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 bg-white" onChange={handleChange} value={form.upiId} />
                  <div className="flex gap-3 mt-3">
                    {["GPay","PhonePe","Paytm","BHIM"].map(app => (
                      <button key={app} className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-rose-400 hover:text-rose-600 transition-colors bg-white">{app}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo note */}
              <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Demo Mode:</strong> Enter any valid-looking details. No real payment will be charged.</span>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:border-gray-400 transition-colors">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-4 btn-primary text-white font-bold rounded-xl text-sm tracking-wide">Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold">3</span>
                Review & Confirm
              </h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <img src={item.image || item.images?.[0]} alt={item.name}
                      className="w-14 h-18 object-cover rounded-lg" onError={e => e.target.src = "https://via.placeholder.com/56x72"} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">Size: {item.size} • Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-gray-800">{formatPrice(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              {/* Address Summary */}
              <div className="p-4 bg-blue-50 rounded-xl mb-6">
                <p className="font-semibold text-gray-800 text-sm mb-1 flex items-center gap-2">📍 Delivery Address</p>
                <p className="text-gray-600 text-sm">{form.firstName} {form.lastName} • {form.phone}</p>
                <p className="text-gray-600 text-sm">{form.address}, {form.city}, {form.state} - {form.pincode}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:border-gray-400 transition-colors">← Back</button>
                <button onClick={handleOrder} className="flex-1 py-4 btn-primary text-white font-bold rounded-xl text-sm tracking-wide">
                  Place Demo Order • {formatPrice(total)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-20">
            <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-2 items-center">
                  <img src={item.image || item.images?.[0]} alt="" className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
                    onError={e => e.target.src = "https://via.placeholder.com/40x48"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">×{item.qty}</p>
                  </div>
                  <span className="text-xs font-bold">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600"><span>Tax (18% GST)</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span><span className="text-rose-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4 flex gap-2">
              <input placeholder="Coupon code" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-rose-400" />
              <button className="px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors">Apply</button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              100% secure & encrypted payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
