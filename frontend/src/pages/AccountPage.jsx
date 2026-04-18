import { useState } from "react";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../data/products";

const mockOrders = [
  { id: "FAS20240101", date: "Jan 12, 2024", status: "Delivered", total: 8999, items: 2,
    products: [
      { name: "Kanjivaram Silk Saree", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&h=100&fit=crop" },
      { name: "Block Heel Sandals", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=80&h=100&fit=crop" },
    ]
  },
  { id: "FAS20240089", date: "Dec 28, 2023", status: "Shipped", total: 4599, items: 1,
    products: [{ name: "Rose Gold Elegance Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=100&fit=crop" }]
  },
  { id: "FAS20240056", date: "Nov 15, 2023", status: "Delivered", total: 2499, items: 3,
    products: [{ name: "Floral Maxi Dress", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=80&h=100&fit=crop" }]
  },
];

const AccountPage = ({ setCurrentPage }) => {
  const { user, setUser, wishlist } = useApp();
  const [activeTab, setActiveTab] = useState("orders");
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: "Rushi Chennuri", email: loginForm.email || "rushi@fashiona.com", avatar: "R" });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setUser({ name: registerForm.name || "New User", email: registerForm.email, avatar: registerForm.name?.[0]?.toUpperCase() || "U" });
  };

  const statusColors = {
    Delivered: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-gray-900 font-bold text-2xl font-display">F</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Welcome to Fashiona</h1>
          <p className="text-gray-500 mt-1 text-sm">Your premium fashion destination</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isLogin ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            Sign In
          </button>
          <button onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isLogin ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            Create Account
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 transition-colors" />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Password</label>
                  <button type="button" className="text-xs text-rose-500 font-medium hover:underline">Forgot password?</button>
                </div>
                <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 transition-colors" />
              </div>
              <button type="submit" className="w-full py-3.5 btn-primary text-white font-bold rounded-xl text-sm tracking-wide mt-2">
                Sign In to Fashiona
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[["G","Google","bg-white border border-gray-200"],["f","Facebook","bg-blue-600 text-white"]].map(([letter, name, cls]) => (
                  <button key={name} type="button"
                    className={`py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${cls}`}>
                    <span className={`font-bold ${name === "Google" ? "text-rose-500" : ""}`}>{letter}</span>
                    <span className={name === "Google" ? "text-gray-700" : ""}>{name}</span>
                  </button>
                ))}
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {[
                ["name","Full Name","text","Your full name"],
                ["email","Email","email","you@example.com"],
                ["password","Password","password","••••••••"],
                ["confirm","Confirm Password","password","••••••••"],
              ].map(([field, label, type, placeholder]) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">{label}</label>
                  <input type={type} placeholder={placeholder}
                    value={registerForm[field]}
                    onChange={e => setRegisterForm({...registerForm, [field]: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 transition-colors" />
                </div>
              ))}
              <div className="flex items-start gap-2 mt-2">
                <input type="checkbox" id="terms" className="mt-0.5 accent-rose-500" />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                  I agree to the <span className="text-rose-500 font-medium cursor-pointer">Terms of Service</span> and <span className="text-rose-500 font-medium cursor-pointer">Privacy Policy</span>
                </label>
              </div>
              <button type="submit" className="w-full py-3.5 btn-primary text-white font-bold rounded-xl text-sm tracking-wide">
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-gray-900 to-purple-900 py-10 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {user.avatar}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-300 text-sm">{user.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-amber-400 font-medium">⭐ Gold Member</span>
              <span className="text-xs text-gray-400">Member since 2024</span>
            </div>
          </div>
          <button onClick={() => setUser(null)} className="ml-auto px-4 py-2 border border-white/20 text-white/70 text-xs rounded-lg hover:border-white/40 hover:text-white transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: mockOrders.length, icon: "📦" },
            { label: "Wishlist Items", value: wishlist.length, icon: "❤️" },
            { label: "Points Earned", value: "2,450", icon: "⭐" },
            { label: "Amount Saved", value: "₹3,200", icon: "💰" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-display text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 overflow-x-auto">
          {[
            { key: "orders", label: "My Orders", icon: "📦" },
            { key: "profile", label: "Profile", icon: "👤" },
            { key: "addresses", label: "Addresses", icon: "📍" },
            { key: "notifications", label: "Notifications", icon: "🔔" },
          ].map(({ key, label, icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === key ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {mockOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-gray-800">Order #{order.id}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>{order.status}</span>
                    <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {order.products.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <img src={p.image} alt={p.name} className="w-12 h-14 object-cover rounded-lg"
                        onError={e => e.target.src = "https://via.placeholder.com/48x56"} />
                      <span className="text-xs text-gray-600 hidden sm:block">{p.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:border-gray-400 transition-colors">Track Order</button>
                  {order.status === "Delivered" && (
                    <button className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-medium rounded-lg hover:bg-rose-100 transition-colors">Return / Exchange</button>
                  )}
                  <button className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:border-gray-400 transition-colors">View Invoice</button>
                  <button onClick={() => setCurrentPage("products")} className="ml-auto px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors">Buy Again</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-6">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {[["Full Name", user.name],["Email", user.email],["Phone", "+91 98765 43210"],["Date of Birth", "March 15, 1995"],["Gender", "Female"]].map(([label, val]) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                  <input defaultValue={val} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 transition-colors" />
                </div>
              ))}
            </div>
            <button className="mt-6 px-6 py-3 btn-primary text-white font-bold rounded-xl text-sm">Save Changes</button>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="space-y-4">
            {[
              { type: "Home", address: "123, MG Road, Koramangala", city: "Bangalore", state: "Karnataka", pin: "560034", default: true },
              { type: "Office", address: "45, Banjara Hills, Road No. 12", city: "Hyderabad", state: "Telangana", pin: "500034", default: false },
            ].map(addr => (
              <div key={addr.type} className="bg-white rounded-2xl p-5 shadow-sm flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-800">{addr.type}</span>
                    {addr.default && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Default</span>}
                  </div>
                  <p className="text-gray-600 text-sm">{addr.address}</p>
                  <p className="text-gray-500 text-sm">{addr.city}, {addr.state} – {addr.pin}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-lg hover:border-gray-400">Edit</button>
                  <button className="px-3 py-1.5 border border-red-200 text-red-500 text-xs rounded-lg hover:border-red-400">Delete</button>
                </div>
              </div>
            ))}
            <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 text-sm font-medium hover:border-rose-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add New Address
            </button>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                ["Order Updates", "Track your orders in real-time", true],
                ["Flash Sale Alerts", "Be first to know about sales", true],
                ["New Arrivals", "Get notified about new products", false],
                ["Newsletter", "Weekly style tips and offers", false],
                ["Push Notifications", "Allow browser notifications", true],
              ].map(([label, desc, def]) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{label}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={def} className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-rose-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
