import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../App'
import { getProductEmoji } from '../components/ProductCard'
import Navbar from '../components/Navbar'

export default function CheckoutPage() {
  const { cart, totalAmount, totalItems, clearCart, deleteFromCart, addToCart, removeFromCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState('cart') // 'cart' | 'checkout'
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', street: '', city: 'Salem', pincode: '', payment: 'cod'
  })

  const deliveryFee = totalAmount >= 299 ? 0 : 25
  const grandTotal = totalAmount + deliveryFee

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handlePlaceOrder = async e => {
    e.preventDefault()
    setPlacing(true)
    try {
      const payload = {
        items: cart.map(i => ({
          product: i.product._id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: '',
        })),
        totalAmount: grandTotal,
        deliveryFee,
        address: {
          name: form.name,
          phone: form.phone,
          street: form.street,
          city: form.city,
          pincode: form.pincode,
        },
        paymentMethod: form.payment,
        status: 'placed',
      }
      const { data } = await axios.post('/api/orders', payload)
      clearCart()
      navigate('/order-success', { state: { order: data } })
    } catch (err) {
      alert('Order failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setPlacing(false)
    }
  }

  if (cart.length === 0 && step === 'cart') {
    return (
      <>
        <Navbar />
        <main className="page">
          <div className="container">
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some groceries to get started!</p>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Browse Products
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="container">

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => step === 'cart' ? navigate('/') : setStep('cart')}
          >
            ← {step === 'cart' ? 'Continue Shopping' : 'Edit Cart'}
          </button>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {step === 'cart' ? '🛒 Cart' : '📦 Checkout'}
          </span>
        </div>

        {step === 'cart' && (
          <div className="cart-page">
            <div className="page-header">
              <div className="page-title">Your Cart</div>
              <div className="page-subtitle">{totalItems} item{totalItems !== 1 ? 's' : ''}</div>
            </div>

            {/* Cart Items */}
            {cart.map(({ product, quantity }) => (
              <div key={product._id} className="cart-item">
                <div className="cart-item-emoji">{getProductEmoji(product.name)}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{product.name}</div>
                  <div className="cart-item-unit">{product.unit}</div>
                  <div className="cart-item-price">₹{product.price * quantity}</div>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-control" style={{ width: 100 }}>
                    <button className="qty-btn" onClick={() => removeFromCart(product._id)}>−</button>
                    <span className="qty-num">{quantity}</span>
                    <button className="qty-btn" onClick={() => addToCart(product)}>+</button>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger)' }}
                    onClick={() => deleteFromCart(product._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span><span>₹{totalAmount}</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              {deliveryFee > 0 && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '4px 0' }}>
                  Add ₹{299 - totalAmount} more for free delivery
                </div>
              )}
              <div className="cart-summary-row total">
                <span>Total</span><span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 16, padding: '14px' }}
              onClick={() => setStep('checkout')}
            >
              Proceed to Checkout →
            </button>
          </div>
        )}

        {step === 'checkout' && (
          <div className="checkout-page">
            <div className="page-header">
              <div className="page-title">Delivery Details</div>
              <div className="page-subtitle">Where should we deliver?</div>
            </div>

            <form onSubmit={handlePlaceOrder}>
              {/* Address Form */}
              <div className="form-card">
                <h3>📍 Delivery Address</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required placeholder="10-digit number" pattern="\d{10}" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input name="street" value={form.street} onChange={handleChange} required placeholder="House/Flat No, Street, Area" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange} required placeholder="6-digit pincode" pattern="\d{6}" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="form-card">
                <h3>💳 Payment Method</h3>
                {[
                  { val: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when your order arrives' },
                  { val: 'upi', label: '📱 UPI / QR Code', desc: 'Pay via any UPI app' },
                  { val: 'card', label: '💳 Credit / Debit Card', desc: 'Secure card payment' },
                ].map(opt => (
                  <label
                    key={opt.val}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 10, marginBottom: 8,
                      border: `1.5px solid ${form.payment === opt.val ? 'var(--primary)' : 'var(--border)'}`,
                      background: form.payment === opt.val ? 'var(--primary-light)' : 'var(--bg)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <input
                      type="radio" name="payment" value={opt.val}
                      checked={form.payment === opt.val}
                      onChange={handleChange}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Order Summary */}
              <div className="form-card">
                <h3>🧾 Order Summary</h3>
                {cart.map(({ product, quantity }) => (
                  <div key={product._id} className="cart-summary-row" style={{ padding: '4px 0' }}>
                    <span>{product.name} × {quantity}</span>
                    <span>₹{product.price * quantity}</span>
                  </div>
                ))}
                <div className="cart-summary-row" style={{ paddingTop: 8, borderTop: '1px solid var(--border)', marginTop: 8 }}>
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="cart-summary-row total">
                  <span>Grand Total</span><span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: 15 }}
                disabled={placing}
              >
                {placing ? '⏳ Placing Order...' : `🚀 Place Order · ₹${grandTotal}`}
              </button>
            </form>
          </div>
        )}
        </div>
      </main>
    </>
  )
}
