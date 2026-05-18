import { useCart } from '../App'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ searchQuery, onSearch }) {
  const { totalItems } = useCart()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <a className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          ⚡ Zepto<span className="brand-dot" />
        </a>

        {/* Search */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for groceries, snacks, drinks..."
            value={searchQuery || ''}
            onChange={e => onSearch?.(e.target.value)}
          />
        </div>

        {/* Cart */}
        <div className="navbar-actions">
          <button className="cart-btn" onClick={() => navigate('/cart')}>
            <span className="cart-btn-icon">🛒</span>
            <span className="cart-count">
              {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? 's' : ''}` : 'Cart'}
            </span>
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}
