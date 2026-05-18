require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zepto_ecommerce';

const categories = [
  { name: 'Fruits & Vegetables', color: '#22C55E', image: '🥦' },
  { name: 'Dairy & Bread', color: '#3B82F6', image: '🥛' },
  { name: 'Snacks & Munchies', color: '#F59E0B', image: '🍿' },
  { name: 'Cold Drinks & Juices', color: '#EF4444', image: '🥤' },
  { name: 'Instant & Frozen Food', color: '#8B5CF6', image: '🍜' },
  { name: 'Atta, Rice & Dal', color: '#D97706', image: '🌾' },
  { name: 'Personal Care', color: '#EC4899', image: '🧴' },
  { name: 'Home & Kitchen', color: '#14B8A6', image: '🏠' },
];

const productsData = [
  // Fruits & Vegetables
  { name: 'Fresh Bananas', description: 'Ripe yellow bananas, perfect for snacking', price: 40, mrp: 55, discount: 27, unit: '1 dozen', isBestSeller: true, catIdx: 0 },
  { name: 'Tomatoes', description: 'Farm-fresh red tomatoes', price: 30, mrp: 40, discount: 25, unit: '500 g', catIdx: 0 },
  { name: 'Onion', description: 'Fresh red onions', price: 35, mrp: 45, discount: 22, unit: '1 kg', catIdx: 0 },
  { name: 'Potato', description: 'Clean washed potatoes', price: 28, mrp: 35, discount: 20, unit: '1 kg', catIdx: 0 },
  { name: 'Green Apple', description: 'Crisp and tangy green apples', price: 160, mrp: 200, discount: 20, unit: '4 pcs', catIdx: 0 },
  { name: 'Capsicum Green', description: 'Fresh green bell peppers', price: 32, mrp: 42, discount: 24, unit: '250 g', catIdx: 0 },

  // Dairy & Bread
  { name: 'Amul Taaza Milk', description: 'Toned fresh milk', price: 25, mrp: 27, discount: 7, unit: '500 ml', isBestSeller: true, catIdx: 1 },
  { name: 'Britannia Bread', description: 'Soft white bread loaf', price: 40, mrp: 45, discount: 11, unit: '400 g', catIdx: 1 },
  { name: 'Amul Butter', description: 'Pasteurized salted butter', price: 56, mrp: 60, discount: 7, unit: '100 g', isBestSeller: true, catIdx: 1 },
  { name: 'Curd', description: 'Fresh natural curd', price: 30, mrp: 35, discount: 14, unit: '400 g', catIdx: 1 },
  { name: 'Paneer', description: 'Fresh cottage cheese', price: 80, mrp: 95, discount: 16, unit: '200 g', catIdx: 1 },
  { name: 'Cheese Slices', description: 'Amul cheese slices pack', price: 120, mrp: 140, discount: 14, unit: '200 g', catIdx: 1 },

  // Snacks & Munchies
  { name: 'Lays Classic Salted', description: 'Crispy potato chips', price: 20, mrp: 20, discount: 0, unit: '52 g', isBestSeller: true, catIdx: 2 },
  { name: 'Kurkure Masala Munch', description: 'Crunchy corn puffs', price: 20, mrp: 20, discount: 0, unit: '75 g', catIdx: 2 },
  { name: 'Dark Fantasy', description: 'Choco-filled cookies', price: 40, mrp: 45, discount: 11, unit: '75 g', isBestSeller: true, catIdx: 2 },
  { name: 'Haldiram Namkeen', description: 'Aloo Bhujia mix', price: 55, mrp: 65, discount: 15, unit: '200 g', catIdx: 2 },
  { name: 'Oreo Cookies', description: 'Chocolate sandwich cookies', price: 30, mrp: 30, discount: 0, unit: '120 g', catIdx: 2 },
  { name: 'Pringles Original', description: 'Stackable potato crisps', price: 149, mrp: 169, discount: 12, unit: '107 g', catIdx: 2 },

  // Cold Drinks & Juices
  { name: 'Coca-Cola', description: 'Classic refreshing cola', price: 40, mrp: 42, discount: 5, unit: '750 ml', isBestSeller: true, catIdx: 3 },
  { name: 'Real Mixed Fruit Juice', description: 'No added sugar juice', price: 99, mrp: 120, discount: 18, unit: '1 L', catIdx: 3 },
  { name: 'Sprite', description: 'Lemon lime sparkling drink', price: 40, mrp: 42, discount: 5, unit: '750 ml', catIdx: 3 },
  { name: 'Tropicana Orange', description: 'Pure orange juice', price: 55, mrp: 65, discount: 15, unit: '200 ml', catIdx: 3 },
  { name: 'Sting Energy', description: 'Berry blast energy drink', price: 20, mrp: 20, discount: 0, unit: '250 ml', catIdx: 3 },
  { name: 'Bisleri Water', description: 'Packaged drinking water', price: 20, mrp: 20, discount: 0, unit: '1 L', catIdx: 3 },

  // Instant & Frozen Food
  { name: 'Maggi Noodles', description: 'Masala instant noodles', price: 14, mrp: 14, discount: 0, unit: '70 g', isBestSeller: true, catIdx: 4 },
  { name: 'McCain French Fries', description: 'Frozen crispy fries', price: 115, mrp: 140, discount: 18, unit: '420 g', catIdx: 4 },
  { name: 'MTR Ready Meals', description: 'Ready to eat dal makhani', price: 75, mrp: 89, discount: 16, unit: '300 g', catIdx: 4 },
  { name: 'Top Ramen Curry', description: 'Curry flavored noodles', price: 12, mrp: 14, discount: 14, unit: '70 g', catIdx: 4 },
  { name: 'Frozen Parathas', description: 'Ready to cook whole wheat', price: 65, mrp: 80, discount: 19, unit: '5 pcs', catIdx: 4 },
  { name: 'Cup Noodles', description: 'Instant cup noodles mazedaar masala', price: 45, mrp: 50, discount: 10, unit: '70 g', catIdx: 4 },

  // Atta, Rice & Dal
  { name: 'Aashirvaad Atta', description: 'Whole wheat flour', price: 245, mrp: 290, discount: 16, unit: '5 kg', isBestSeller: true, catIdx: 5 },
  { name: 'India Gate Basmati', description: 'Premium basmati rice', price: 399, mrp: 450, discount: 11, unit: '5 kg', catIdx: 5 },
  { name: 'Toor Dal', description: 'Premium unpolished toor dal', price: 145, mrp: 170, discount: 15, unit: '1 kg', catIdx: 5 },
  { name: 'Moong Dal', description: 'Yellow moong dal', price: 130, mrp: 155, discount: 16, unit: '1 kg', catIdx: 5 },
  { name: 'Sugar', description: 'Refined white sugar', price: 45, mrp: 50, discount: 10, unit: '1 kg', catIdx: 5 },
  { name: 'Sona Masoori Rice', description: 'Premium raw rice', price: 320, mrp: 380, discount: 16, unit: '5 kg', catIdx: 5 },

  // Personal Care
  { name: 'Dove Soap', description: 'Moisturizing beauty bar', price: 48, mrp: 55, discount: 13, unit: '100 g', isBestSeller: true, catIdx: 6 },
  { name: 'Colgate MaxFresh', description: 'Cooling crystal toothpaste', price: 85, mrp: 99, discount: 14, unit: '150 g', catIdx: 6 },
  { name: 'Head & Shoulders', description: 'Anti-dandruff shampoo', price: 195, mrp: 230, discount: 15, unit: '340 ml', catIdx: 6 },
  { name: 'Nivea Body Lotion', description: 'Deep moisture body lotion', price: 195, mrp: 225, discount: 13, unit: '200 ml', catIdx: 6 },
  { name: 'Dettol Handwash', description: 'Original liquid handwash', price: 99, mrp: 115, discount: 14, unit: '200 ml', catIdx: 6 },
  { name: 'Gillette Guard Razor', description: 'Smooth shave razor', price: 65, mrp: 75, discount: 13, unit: '1 pc', catIdx: 6 },

  // Home & Kitchen
  { name: 'Vim Dishwash Bar', description: 'Lemon fresh dishwash', price: 10, mrp: 10, discount: 0, unit: '130 g', isBestSeller: true, catIdx: 7 },
  { name: 'Harpic Toilet Cleaner', description: 'Power plus disinfectant', price: 85, mrp: 99, discount: 14, unit: '500 ml', catIdx: 7 },
  { name: 'Surf Excel Liquid', description: 'Matic front load detergent', price: 235, mrp: 270, discount: 13, unit: '1 L', catIdx: 7 },
  { name: 'Garbage Bags', description: 'Oxo-biodegradable bags', price: 75, mrp: 90, discount: 17, unit: '30 pcs', catIdx: 7 },
  { name: 'Scotch-Brite Scrub Pad', description: 'Heavy duty scrub sponge', price: 30, mrp: 35, discount: 14, unit: '1 pc', catIdx: 7 },
  { name: 'Room Freshener', description: 'Odonil lavender air freshener', price: 55, mrp: 65, discount: 15, unit: '75 g', catIdx: 7 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared old data');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Inserted ${createdCategories.length} categories`);

    // Map products to category IDs
    const products = productsData.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      mrp: p.mrp,
      discount: p.discount,
      unit: p.unit,
      isBestSeller: p.isBestSeller || false,
      category: createdCategories[p.catIdx]._id,
      image: '',
      stock: Math.floor(Math.random() * 200) + 50,
    }));

    const createdProducts = await Product.insertMany(products);
    console.log(`Inserted ${createdProducts.length} products`);

    console.log('\n🌱 Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
