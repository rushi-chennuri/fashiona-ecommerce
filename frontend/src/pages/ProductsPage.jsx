import { useState, useMemo } from "react";
import { products, categories, formatPrice } from "../data/products";
import ProductCard from "../components/ProductCard";

const ProductsPage = ({ setCurrentPage, setSelectedProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory !== "all") result = result.filter(p => p.category === selectedCategory);
    if (searchTerm) result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.tags?.some(t => t.includes(searchTerm.toLowerCase())));
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") result = [...result].sort((a, b) => b.id - a.id);
    else result = [...result].sort((a, b) => b.reviews - a.reviews);
    return result;
  }, [selectedCategory, sortBy, priceRange, searchTerm]);

  const paginated = filtered.slice(0, page * perPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-purple-900 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-gray-400 text-sm mb-4 flex items-center gap-2">
            <button onClick={() => setCurrentPage("home")} className="hover:text-white transition-colors">Home</button>
            <span>/</span>
            <span className="text-white font-medium capitalize">{selectedCategory === "all" ? "All Products" : selectedCategory}</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            {selectedCategory === "all" ? "All Collections" : categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
          </h1>
          <p className="text-gray-300">{filtered.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-60 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-rose-400 text-sm" />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
            </button>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:border-rose-400 cursor-pointer">
              <option value="popularity">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View mode */}
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z"/></svg>
              </button>
              <button onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0 space-y-5">
              {/* Categories */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Categories</h3>
                <div className="space-y-2">
                  <button onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all flex items-center justify-between ${selectedCategory === "all" ? "bg-rose-50 text-rose-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                    All Products
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{products.length}</span>
                  </button>
                  {categories.map(cat => (
                    <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all flex items-center justify-between ${selectedCategory === cat.slug ? "bg-rose-50 text-rose-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                      <span className="flex items-center gap-2">{cat.icon} {cat.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Price Range</h3>
                <div className="space-y-3">
                  <input type="range" min={0} max={20000} step={100} value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                    className="w-full accent-rose-500" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(0)}</span>
                    <span className="font-semibold text-rose-600">{formatPrice(priceRange[1])}</span>
                  </div>
                  {[
                    [0, 1000], [1000, 3000], [3000, 7000], [7000, 20000]
                  ].map(([min, max]) => (
                    <button key={min} onClick={() => setPriceRange([min, max])}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${priceRange[0] === min && priceRange[1] === max ? "bg-rose-50 text-rose-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                      {formatPrice(min)} – {formatPrice(max)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratings Filter */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Min Rating</h3>
                {[4.5, 4.0, 3.5].map(r => (
                  <button key={r} className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-600">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-3.5 h-3.5 ${s <= r ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))} & above
                  </button>
                ))}
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-bold text-xl text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
                <button onClick={() => { setSelectedCategory("all"); setSearchTerm(""); setPriceRange([0, 20000]); }}
                  className="mt-4 px-6 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"}>
                  {paginated.map(product => (
                    viewMode === "grid"
                      ? <ProductCard key={product.id} product={product} setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} />
                      : (
                        <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => { setSelectedProduct(product); setCurrentPage("product-detail"); }}>
                          <img src={product.images[0]} alt={product.name} className="w-24 h-32 object-cover rounded-xl flex-shrink-0"
                            onError={e => e.target.src = "https://via.placeholder.com/96x128"} />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{product.name}</h3>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="font-bold text-rose-600">{formatPrice(product.price)}</span>
                              <span className="text-gray-400 text-sm line-through">{formatPrice(product.originalPrice)}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {[1,2,3,4,5].map(s => <svg key={s} className={`w-3 h-3 ${s <= product.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                              <span className="text-gray-500 text-xs">({product.reviews})</span>
                            </div>
                          </div>
                        </div>
                      )
                  ))}
                </div>

                {paginated.length < filtered.length && (
                  <div className="text-center mt-10">
                    <button onClick={() => setPage(p => p + 1)}
                      className="px-8 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors text-sm">
                      Load More ({filtered.length - paginated.length} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
