import { useState, useEffect } from "react";
import { categories, products, formatPrice } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

const HeroSlide = ({ setCurrentPage }) => {
  const slides = [
    {
      headline: "New Collection 2024",
      subheadline: "Discover Timeless Elegance",
      description: "Explore our curated collection of premium sarees, dresses, and accessories that celebrate your unique style.",
      cta: "Shop Now",
      bg: "from-gray-900 via-purple-900 to-gray-900",
      tag: "🔥 UP TO 60% OFF",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&h=900&fit=crop",
      accent: "gold",
    },
    {
      headline: "Wedding Season Sale",
      subheadline: "Look Your Best at Every Ceremony",
      description: "From silk sarees to bridal lehengas — find your perfect wedding look with free express delivery.",
      cta: "Explore Bridal",
      bg: "from-rose-900 via-pink-900 to-purple-900",
      tag: "💍 BRIDAL COLLECTION",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&h=900&fit=crop",
      accent: "rose",
    },
    {
      headline: "Footwear Fiesta",
      subheadline: "Step Into Style",
      description: "Over 500 styles of heels, sneakers, juttis and sandals. Walk with confidence every day.",
      cta: "Shop Footwear",
      bg: "from-blue-900 via-indigo-900 to-gray-900",
      tag: "👠 FLAT 40% OFF",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&h=900&fit=crop",
      accent: "blue",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => { setCurrent(p => (p + 1) % slides.length); setAnimating(false); }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className={`relative min-h-[85vh] bg-gradient-to-r ${slide.bg} overflow-hidden transition-all duration-700`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px"
        }}></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 transition-all duration-500 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>

          {/* Left Content */}
          <div className="text-white space-y-6">
            <span className="inline-block px-4 py-1.5 bg-amber-400 text-gray-900 text-xs font-bold rounded-full tracking-widest uppercase animate-pulse">
              {slide.tag}
            </span>

            <div>
              <p className="text-amber-400 font-medium tracking-widest text-sm uppercase mb-2">{slide.subheadline}</p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                {slide.headline.split(" ").map((word, i) => (
                  <span key={i} className={i === slide.headline.split(" ").length - 1 ? "text-amber-400" : ""}>
                    {word}{" "}
                  </span>
                ))}
              </h1>
            </div>

            <p className="text-gray-300 text-lg max-w-md leading-relaxed">{slide.description}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button onClick={() => setCurrentPage("products")}
                className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-rose-500/30 transition-all duration-300 hover:-translate-y-1 text-sm tracking-wide">
                {slide.cta} →
              </button>
              <button onClick={() => setCurrentPage("products")}
                className="px-8 py-4 border-2 border-white/30 text-white font-medium rounded-xl hover:border-white/60 hover:bg-white/10 transition-all duration-300 text-sm tracking-wide">
                View Lookbook
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4 border-t border-white/10">
              {[["50K+","Happy Customers"],["1000+","Products"],["Free","Express Delivery"]].map(([num, label]) => (
                <div key={label}>
                  <div className="text-amber-400 font-bold text-xl font-display">{num}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex justify-center relative">
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute -inset-8 rounded-full border border-white/10 animate-spin" style={{animationDuration:"20s"}}></div>
              <div className="absolute -inset-16 rounded-full border border-white/5 animate-spin" style={{animationDuration:"30s",animationDirection:"reverse"}}></div>

              <div className="w-72 h-96 lg:w-80 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20">
                <img src={slide.image} alt="Fashion" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-16 top-16 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  <div>
                    <p className="text-white text-xs font-semibold">New Arrival</p>
                    <p className="text-gray-300 text-[10px]">Just dropped today</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-12 bottom-24 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="text-amber-400 text-xl">⭐</div>
                  <div>
                    <p className="text-white text-xs font-semibold">4.8/5 Rating</p>
                    <p className="text-gray-300 text-[10px]">50K+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? "w-8 h-2 bg-amber-400" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}></button>
        ))}
      </div>
    </div>
  );
};

const TrustBar = () => (
  <div className="bg-white border-y border-gray-100 py-5">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { icon: "🚚", title: "Free Delivery", desc: "On orders ₹999+" },
        { icon: "🔄", title: "Easy Returns", desc: "30-day hassle-free" },
        { icon: "🔒", title: "Secure Payment", desc: "100% safe checkout" },
        { icon: "💎", title: "Premium Quality", desc: "Certified authentic" },
      ].map(({ icon, title, desc }) => (
        <div key={title} className="flex items-center gap-3 justify-center sm:justify-start">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="font-semibold text-sm text-gray-800">{title}</p>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CategoryGrid = ({ setCurrentPage }) => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-10">
        <p className="text-rose-500 font-medium text-sm tracking-widest uppercase mb-2">Browse by Category</p>
        <h2 className="font-display text-4xl font-bold text-gray-900">Shop <span className="text-rose-600">Collections</span></h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">Find your perfect style across our wide range of fashion categories</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <div key={cat.id}
            onClick={() => setCurrentPage("products")}
            className="category-card group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-md hover:shadow-xl">
            <img src={cat.image} alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={e => e.target.src = `https://via.placeholder.com/300x375?text=${cat.name}`} />
            <div className="category-overlay absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
            <div className="category-text absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xl mb-0.5">{cat.icon}</p>
              <h3 className="text-white font-bold text-base font-display">{cat.name}</h3>
              <p className="text-gray-300 text-xs">{cat.count} items</p>
            </div>
            <div className="absolute top-3 right-3 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedProducts = ({ setCurrentPage, setSelectedProduct }) => {
  const [activeTab, setActiveTab] = useState("trending");
  const tabs = [
    { key: "trending", label: "Trending Now" },
    { key: "new", label: "New Arrivals" },
    { key: "sale", label: "On Sale" },
    { key: "bestseller", label: "Best Sellers" },
  ];

  const filtered = products.filter(p => p.badge === activeTab || (activeTab === "trending" && p.rating >= 4.5)).slice(0, 8);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-rose-500 font-medium text-sm tracking-widest uppercase mb-2">Handpicked for You</p>
          <h2 className="font-display text-4xl font-bold text-gray-900">Featured <span className="text-rose-600">Products</span></h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button onClick={() => setCurrentPage("products")}
            className="px-8 py-3.5 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 text-sm tracking-wide inline-flex items-center gap-2">
            View All Products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

const BannerSection = ({ setCurrentPage }) => (
  <section className="py-8 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: "Ethnic Wear", subtitle: "Up to 50% Off", color: "from-purple-600 to-indigo-700",
          image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=250&fit=crop" },
        { title: "Party Dresses", subtitle: "New Arrivals", color: "from-rose-500 to-pink-600",
          image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=250&fit=crop" },
        { title: "Luxury Watches", subtitle: "Premium Collection", color: "from-amber-600 to-orange-600",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=250&fit=crop" },
      ].map(({ title, subtitle, color, image }) => (
        <div key={title} onClick={() => setCurrentPage("products")}
          className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg h-40 sm:h-52">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-70 group-hover:opacity-80 transition-opacity`}></div>
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <p className="text-white/80 text-xs font-medium tracking-widest uppercase">{subtitle}</p>
            <h3 className="text-white font-bold text-xl font-display">{title}</h3>
            <span className="inline-flex items-center gap-1 text-white/80 text-xs mt-2 group-hover:gap-2 transition-all">
              Shop Now <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Testimonials = () => {
  const reviews = [
    { name: "Priya Sharma", location: "Mumbai", rating: 5, text: "Absolutely love the Kanjivaram saree I ordered! The quality is exceptional and it arrived perfectly packaged. Will definitely shop again.", avatar: "P", product: "Kanjivaram Silk Saree" },
    { name: "Ananya Mehta", location: "Delhi", rating: 5, text: "The floral maxi dress fits like a dream! Fast delivery and the material is just as described. Fashiona has become my go-to store!", avatar: "A", product: "Floral Maxi Dress" },
    { name: "Kavya Nair", location: "Bangalore", rating: 5, text: "The rose gold watch exceeded my expectations. Packaging was luxurious and it looks stunning on my wrist. 10/10 recommend!", avatar: "K", product: "Rose Gold Watch" },
    { name: "Deepa Reddy", location: "Hyderabad", rating: 5, text: "Bought the embroidered juttis and I'm obsessed! The craftsmanship is amazing and so comfortable to wear all day.", avatar: "D", product: "Embroidered Juttis" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-rose-500 font-medium text-sm tracking-widest uppercase mb-2">What Our Customers Say</p>
          <h2 className="font-display text-4xl font-bold text-gray-900">Customer <span className="text-rose-600">Reviews</span></h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-xl">★</span>)}
            <span className="text-gray-600 font-semibold">4.8/5 from 50,000+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-0.5 mb-3">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.location} • <span className="text-rose-500">{r.product}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {["🥻","👗","👠","⌚","🧢","💍"].map((emoji, i) => (
          <span key={i} className="absolute text-6xl select-none"
            style={{ top: `${(i * 17) % 80}%`, left: `${(i * 19) % 90}%`, transform: `rotate(${i * 30}deg)`, opacity: 0.5 }}>
            {emoji}
          </span>
        ))}
      </div>
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <span className="text-5xl mb-4 block">✉️</span>
        <h2 className="font-display text-4xl font-bold text-white mb-3">
          Get <span className="text-amber-400">Exclusive</span> Deals
        </h2>
        <p className="text-gray-300 mb-8 text-lg">Subscribe for early access to new collections, exclusive discounts, and style tips from our experts.</p>

        {subscribed ? (
          <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 text-white">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-bold text-lg">Welcome to the Fashiona family!</p>
            <p className="text-green-300 text-sm mt-1">Check your inbox for a 20% welcome discount.</p>
          </div>
        ) : (
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors text-sm" />
            <button onClick={() => email && setSubscribed(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all text-sm whitespace-nowrap">
              Subscribe
            </button>
          </div>
        )}
        <p className="text-gray-500 text-xs mt-4">No spam ever. Unsubscribe anytime. 💌</p>
      </div>
    </section>
  );
};

const HomePage = ({ setCurrentPage, setSelectedProduct }) => (
  <div>
    <HeroSlide setCurrentPage={setCurrentPage} />
    <TrustBar />
    <CategoryGrid setCurrentPage={setCurrentPage} />
    <FeaturedProducts setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} />
    <BannerSection setCurrentPage={setCurrentPage} />
    <Testimonials />
    <NewsletterSection />
  </div>
);

export default HomePage;
