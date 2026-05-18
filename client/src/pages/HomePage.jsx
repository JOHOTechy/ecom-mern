import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'

const CAT_EMOJIS = {
  'Fruits & Vegetables': '🥦',
  'Dairy & Bread': '🥛',
  'Snacks & Munchies': '🍿',
  'Cold Drinks & Juices': '🥤',
  'Instant & Frozen Food': '🍜',
  'Atta, Rice & Dal': '🌾',
  'Personal Care': '🧴',
  'Home & Kitchen': '🏠',
}

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch categories
  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data)).catch(console.error)
  }, [])

  // Fetch products whenever filter changes
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {}
      if (activeCategory !== 'all') params.category = activeCategory
      if (searchQuery.trim()) params.search = searchQuery.trim()
      const { data } = await axios.get('/api/products', { params })
      setProducts(data)
    } catch (err) {
      setError('Failed to load products. Is the server running?')
    } finally {
      setLoading(false)
    }
  }, [activeCategory, searchQuery])

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300)
    return () => clearTimeout(t)
  }, [fetchProducts])

  // Group products by category for "All" view
  const grouped = activeCategory === 'all' && !searchQuery
    ? categories.map(cat => ({
        cat,
        items: products.filter(p => p.category?._id === cat._id),
      })).filter(g => g.items.length > 0)
    : null

  return (
    <>
      <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />

      {/* Category Bar */}
      <div className="category-bar">
        <div className="category-bar-inner">
          <button
            className={`cat-chip ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            🛒 All
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              className={`cat-chip ${activeCategory === cat._id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat._id)}
            >
              <span className="cat-chip-emoji">{CAT_EMOJIS[cat.name] || '📦'}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <main className="page">
        <div className="container">

          {/* Hero Banner */}
          {!searchQuery && activeCategory === 'all' && (
            <div className="hero-banner">
              <h2>Groceries delivered in 10 minutes ⚡</h2>
              <p>Fresh products at the best prices, straight to your door</p>
              <div className="hero-badges">
                <span className="hero-badge">🚀 10-min delivery</span>
                <span className="hero-badge">✅ Fresh guarantee</span>
                <span className="hero-badge">🎁 No min order</span>
              </div>
              <span className="hero-emoji">🛒</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--danger)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
              <h3>{error}</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
                Make sure MongoDB is running and the server is started.
              </p>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && !error && (
            <div className="loading-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" />
              ))}
            </div>
          )}

          {/* Search results — flat grid */}
          {!loading && !error && searchQuery && (
            <div className="section">
              <div className="section-title">
                🔍 Results for &ldquo;{searchQuery}&rdquo;
                <span style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 400 }}>
                  ({products.length} found)
                </span>
              </div>
              {products.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🔍</div>
                  <h2>No results found</h2>
                  <p>Try a different keyword</p>
                </div>
              ) : (
                <div className="product-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
              )}
            </div>
          )}

          {/* Category filtered — flat grid */}
          {!loading && !error && activeCategory !== 'all' && !searchQuery && (
            <div className="section">
              <div className="section-title">
                {CAT_EMOJIS[categories.find(c => c._id === activeCategory)?.name] || '📦'}
                &nbsp;{categories.find(c => c._id === activeCategory)?.name}
              </div>
              <div className="product-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}

          {/* All categories — grouped sections */}
          {!loading && !error && !searchQuery && activeCategory === 'all' && grouped && (
            <>
              {/* Best Sellers first */}
              {(() => {
                const bs = products.filter(p => p.isBestSeller)
                return bs.length > 0 ? (
                  <div className="section">
                    <div className="section-title">⭐ Best Sellers</div>
                    <div className="product-grid">
                      {bs.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                  </div>
                ) : null
              })()}

              {/* Per-category sections */}
              {grouped.map(({ cat, items }) => (
                <div key={cat._id} className="section">
                  <div className="section-title">
                    {CAT_EMOJIS[cat.name] || '📦'} {cat.name}
                    <button
                      style={{
                        fontSize: 12, fontWeight: 500, color: 'var(--primary)',
                        background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto',
                      }}
                      onClick={() => setActiveCategory(cat._id)}
                    >
                      See all →
                    </button>
                  </div>
                  <div className="product-grid">
                    {items.map(p => <ProductCard key={p._id} product={p} />)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </>
  )
}
