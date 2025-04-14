const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const marketingRoutes = require('./routes/marketingRoutes');
const deliveryZoneRoutes = require('./routes/deliveryZoneRoutes');
const reportRoutes = require('./routes/reportRoutes');
const farmerBrandRoutes = require('./routes/farmerBrandRoutes');
const brandRoutes = require('./routes/brandRoutes');
const cartRoutes = require('./routes/cartRoutes'); // Add this line

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/delivery-zones', deliveryZoneRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/farmer/brand', farmerBrandRoutes);
app.use('/api/farmer/brand', brandRoutes);
app.use('/api/cart', cartRoutes); // Add this line

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to FarmFresh API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
