import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { products, formatPrice } from "../data/products";

const SearchModal = ({ setCurrentPage, setSelectedProduct }) => {
  const { searchOpen, setSearchOpen } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const recent = ["Silk Saree", "Maxi Dress", "Rose Gold Watch", "Sneakers"];
  const trending = ["Kanjivaram", "Stiletto", "Anarkali", "Smartwatch", "Baseball Cap"];

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.includes(q) ||
      p.tags?.some(t => t.includes(q))
    ).slice(0, 6));
  }, [query]);

  useEffect(() => {
    if (searchOpen) { setTimeout(() => document.getElementById("search-input")?.focus(), 100); }
    else setQuery("");
  }, [searchOpen]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
      onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input id="search-input" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search for sarees, dresses, shoes, watches..."
            className="flex-1 text-base text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button onClick={() => setSearchOpen(false)} className="text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded font-medium hover:bg-gray-50">ESC</button>
        </div>

        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {!query ? (
            <>
              {/* Recent Searches */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {recent.map(r => (
                    <button key={r} onClick={() => setQuery(r)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors">
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Trending Now 🔥</p>
                <div className="flex flex-wrap gap-2">
                  {trending.map(t => (
                    <button key={t} onClick={() => setQuery(t)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors">
                      🔥 {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-5 grid grid-cols-4 gap-3">
                {[
                  { icon: "🥻", label: "Sarees" }, { icon: "👗", label: "Dresses" },
                  { icon: "👠", label: "Shoes" }, { icon: "⌚", label: "Watches" },
                ].map(({ icon, label }) => (
                  <button key={label} onClick={() => { setQuery(label.toLowerCase()); }}
                    className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-xs font-medium text-gray-600">{label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {results.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">😕</div>
                  <p className="font-semibold text-gray-700 mb-1">No results for "{query}"</p>
                  <p className="text-gray-400 text-sm">Try different keywords or browse our categories</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{results.length} Results</p>
                  <div className="space-y-2">
                    {results.map(product => (
                      <button key={product.id}
                        onClick={() => { setSelectedProduct(product); setCurrentPage("product-detail"); setSearchOpen(false); }}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                        <img src={product.images[0]} alt={product.name}
                          className="w-12 h-14 object-cover rounded-lg flex-shrink-0"
                          onError={e => e.target.src = "https://via.placeholder.com/48x56"} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm group-hover:text-rose-600 transition-colors">{product.name}</p>
                          <p className="text-gray-400 text-xs capitalize mt-0.5">{product.category}</p>
                          <p className="text-rose-600 font-bold text-sm mt-0.5">{formatPrice(product.price)}</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <span className="text-xs text-gray-600">{product.rating}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button onClick={() => { setCurrentPage("products"); setSearchOpen(false); }}
                    className="w-full mt-4 py-3 bg-gray-900 text-white font-medium rounded-xl text-sm hover:bg-gray-800 transition-colors">
                    View all results for "{query}"
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
