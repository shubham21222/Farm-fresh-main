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
const analyticsRoutes = require('./routes/analyticsRoutes');
const bulkProductRoutes = require('./routes/bulkProductRoutes');
const reviewModerationRoutes = require('./routes/reviewModerationRoutes');

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
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/farmers', farmerRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/products/bulk', bulkProductRoutes);
app.use('/api/v1/reviews/moderation', reviewModerationRoutes);

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
