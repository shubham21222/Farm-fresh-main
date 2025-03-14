const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmfresh';

const sampleProducts = [
  {
    name: 'Fresh Organic Apples',
    description: 'Sweet and juicy organic apples from local farms',
    price: 4.99,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    stock: 50,
    unit: 'piece',
    isOrganic: true,
    isAvailable: true
  },
  {
    name: 'Organic Carrots',
    description: 'Fresh organic carrots packed with nutrients',
    price: 3.99,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    stock: 75,
    unit: 'kg',
    isOrganic: true,
    isAvailable: true
  },
  {
    name: 'Organic Milk',
    description: 'Farm-fresh organic milk from grass-fed cows',
    price: 5.99,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    stock: 30,
    unit: 'litre',
    isOrganic: true,
    isAvailable: true
  },
  {
    name: 'Organic Brown Rice',
    description: 'Whole grain organic brown rice',
    price: 8.99,
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    stock: 100,
    unit: 'kg',
    isOrganic: true,
    isAvailable: true
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a farmer user to associate with products
    const farmer = await User.findOne({ role: 'farmer' });
    if (!farmer) {
      console.error('No farmer found in the database. Please create a farmer first.');
      process.exit(1);
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add sample products with farmer reference
    const products = sampleProducts.map(product => ({
      ...product,
      farmer: farmer._id
    }));

    await Product.insertMany(products);
    console.log('Added sample products successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts(); 