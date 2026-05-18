import { createContext, useContext, useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

// ─── Cart Context ──────────────────────────────────────────────────────────
export const CartContext = createContext(null)

export function useCart() {
  return useContext(CartContext)
}

function CartProvider({ children }) {
  const [cart, setCart] = useState([]) // [{ product, quantity }]
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((msg, icon = '✅') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, icon }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500)
  }, [])

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product._id === product._id)
      if (existing) {
        return prev.map(i =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    showToast(`${product.name} added!`)
  }, [showToast])

  const removeFromCart = useCallback((productId) => {
    setCart(prev => {
      const item = prev.find(i => i.product._id === productId)
      if (!item) return prev
      if (item.quantity === 1) return prev.filter(i => i.product._id !== productId)
      return prev.map(i =>
        i.product._id === productId ? { ...i, quantity: i.quantity - 1 } : i
      )
    })
  }, [])

  const deleteFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(i => i.product._id !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)
  const totalAmount = cart.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart, totalItems, totalAmount,
      addToCart, removeFromCart, deleteFromCart, clearCart,
    }}>
      {children}
      {/* Toast container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <span>{t.icon}</span> {t.msg}
          </div>
        ))}
      </div>
    </CartContext.Provider>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
      </Routes>
    </CartProvider>
  )
}
