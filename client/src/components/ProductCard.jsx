import { useCart } from '../App'

// Map product names/categories to emojis for visual display
const EMOJI_MAP = {
  // Fruits & Vegetables
  'Fresh Bananas': '🍌', 'Tomatoes': '🍅', 'Onion': '🧅', 'Potato': '🥔',
  'Green Apple': '🍏', 'Capsicum Green': '🫑',
  // Dairy & Bread
  'Amul Taaza Milk': '🥛', 'Britannia Bread': '🍞', 'Amul Butter': '🧈',
  'Curd': '🍶', 'Paneer': '🧀', 'Cheese Slices': '🧀',
  // Snacks
  'Lays Classic Salted': '🥔', 'Kurkure Masala Munch': '🌽', 'Dark Fantasy': '🍪',
  'Haldiram Namkeen': '🥜', 'Oreo Cookies': '🍪', 'Pringles Original': '🥔',
  // Drinks
  'Coca-Cola': '🥤', 'Real Mixed Fruit Juice': '🧃', 'Sprite': '🥤',
  'Tropicana Orange': '🍊', 'Sting Energy': '⚡', 'Bisleri Water': '💧',
  // Instant Food
  'Maggi Noodles': '🍜', 'McCain French Fries': '🍟', 'MTR Ready Meals': '🍛',
  'Top Ramen Curry': '🍜', 'Frozen Parathas': '🫓', 'Cup Noodles': '🍜',
  // Atta Rice Dal
  'Aashirvaad Atta': '🌾', 'India Gate Basmati': '🍚', 'Toor Dal': '🫘',
  'Moong Dal': '🫘', 'Sugar': '🍬', 'Sona Masoori Rice': '🍚',
  // Personal Care
  'Dove Soap': '🧼', 'Colgate MaxFresh': '🦷', 'Head & Shoulders': '🧴',
  'Nivea Body Lotion': '🧴', 'Dettol Handwash': '🧴', 'Gillette Guard Razor': '🪒',
  // Home & Kitchen
  'Vim Dishwash Bar': '🫧', 'Harpic Toilet Cleaner': '🧹', 'Surf Excel Liquid': '🫧',
  'Garbage Bags': '🗑️', 'Scotch-Brite Scrub Pad': '🧽', 'Room Freshener': '🌸',
}

export function getProductEmoji(name) {
  return EMOJI_MAP[name] || '🛍️'
}

export default function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart } = useCart()
  const cartItem = cart.find(i => i.product._id === product._id)
  const qty = cartItem?.quantity || 0
  const emoji = getProductEmoji(product.name)

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <span className="product-emoji">{emoji}</span>
        <div className="product-tags">
          {product.isBestSeller && <span className="tag tag-bestseller">⭐ Best</span>}
          {product.discount > 0 && (
            <span className="tag tag-discount">{product.discount}% OFF</span>
          )}
        </div>
      </div>
      <div className="product-info">
        <div className="product-unit">{product.unit}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-price-row">
          <span className="product-price">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="product-mrp">₹{product.mrp}</span>
          )}
        </div>
        <div className="product-action">
          {qty === 0 ? (
            <button className="add-btn" onClick={() => addToCart(product)}>
              + Add
            </button>
          ) : (
            <div className="qty-control">
              <button className="qty-btn" onClick={() => removeFromCart(product._id)}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => addToCart(product)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
