import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function OrderSuccessPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state?.order

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="container">
        <div className="success-page">
          <div className="success-icon">✅</div>
          <h1>Order Placed!</h1>
          <p>
            Your order has been confirmed and will be delivered in <strong>10 minutes</strong>.
          </p>

          {order && (
            <div className="order-id-box">
              Order ID: #{order._id?.slice(-8).toUpperCase()}
            </div>
          )}

          <div className="delivery-card">
            <div className="delivery-icon">🏍️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>On its way!</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                Estimated delivery: <strong>10 mins</strong>
              </div>
              {order?.address && (
                <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                  📍 {order.address.street}, {order.address.city} — {order.address.pincode}
                </div>
              )}
            </div>
          </div>

          {order && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: 16, marginBottom: 24, textAlign: 'left'
            }}>
              <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>🧾 Order Details</div>
              {order.items?.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 13, color: 'var(--text-muted)', padding: '3px 0'
                }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontWeight: 700, fontSize: 15, borderTop: '1px solid var(--border)',
                marginTop: 8, paddingTop: 10
              }}>
                <span>Total Paid</span>
                <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              🛒 Continue Shopping
            </button>
          </div>
        </div>
        </div>
      </main>
    </>
  )
}
