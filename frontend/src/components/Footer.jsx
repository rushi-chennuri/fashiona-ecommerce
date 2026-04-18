const Footer = ({ setCurrentPage }) => (
  <footer className="footer-gradient text-gray-300">
    {/* Main Footer */}
    <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">

      {/* Brand */}
      <div className="col-span-2 sm:col-span-1">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center">
            <span className="text-gray-900 font-bold text-lg font-display">F</span>
          </div>
          <div>
            <div className="font-display font-bold text-white text-xl">FASHIONA</div>
            <div className="text-amber-400 text-[9px] tracking-[3px] -mt-0.5">PREMIUM FASHION</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-gray-400 mb-5">
          Your one-stop destination for premium fashion. From elegant sarees to trendy western wear — we bring you the best.
        </p>
        {/* Social Links */}
        <div className="flex items-center gap-3">
          {[
            { icon: "f", label: "Facebook", color: "hover:bg-blue-600" },
            { icon: "📸", label: "Instagram", color: "hover:bg-pink-600" },
            { icon: "t", label: "Twitter", color: "hover:bg-sky-500" },
            { icon: "▶", label: "YouTube", color: "hover:bg-red-600" },
          ].map(({ icon, label, color }) => (
            <button key={label} title={label}
              className={`w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-sm text-gray-400 hover:text-white transition-all ${color} hover:border-transparent`}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h4>
        <ul className="space-y-2.5">
          {[
            ["Home","home"],["Products","products"],["New Arrivals","products"],
            ["Sale","products"],["Track Order","account"],["My Account","account"],
          ].map(([label, page]) => (
            <li key={label}>
              <button onClick={() => setCurrentPage(page)}
                className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">
                <span className="text-rose-500 text-xs">›</span> {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Categories</h4>
        <ul className="space-y-2.5">
          {["Sarees 🥻","Dresses 👗","Shoes 👠","Watches ⌚","Caps 🧢","Slippers 🩴","Kurtas 👘","Accessories 💍"].map(cat => (
            <li key={cat}>
              <button onClick={() => setCurrentPage("products")}
                className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">
                <span className="text-rose-500 text-xs">›</span> {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact & App */}
      <div>
        <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Contact Us</h4>
        <div className="space-y-3 mb-6">
          {[
            { icon: "📧", text: "support@fashiona.com" },
            { icon: "📞", text: "+91 98765 43210" },
            { icon: "🕐", text: "Mon–Sat, 9AM – 6PM IST" },
            { icon: "📍", text: "Hyderabad, India" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-2 text-sm text-gray-400">
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>

        <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">Get Our App</h4>
        <div className="space-y-2">
          {[
            { store: "App Store", icon: "🍎", sub: "Download on the" },
            { store: "Google Play", icon: "🤖", sub: "Get it on" },
          ].map(({ store, icon, sub }) => (
            <button key={store}
              className="w-full flex items-center gap-3 px-3 py-2.5 border border-gray-700 rounded-xl hover:border-gray-500 hover:bg-white/5 transition-all">
              <span className="text-xl">{icon}</span>
              <div className="text-left">
                <p className="text-[10px] text-gray-500 leading-none">{sub}</p>
                <p className="text-white text-xs font-bold">{store}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Payment Methods */}
    <div className="border-t border-gray-800 py-5 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">We accept:</span>
          {["Visa","MC","Amex","UPI","Paytm","GPay","COD"].map(pm => (
            <span key={pm} className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded font-medium border border-gray-700">
              {pm}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          SSL Secured & 100% Safe Checkout
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-800 py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <p>© 2024 Fashiona. All rights reserved. Made with ❤️ in India</p>
        <div className="flex items-center gap-4">
          {["Privacy Policy","Terms of Service","Shipping Policy","Return Policy"].map(link => (
            <button key={link} className="hover:text-gray-300 transition-colors">{link}</button>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
