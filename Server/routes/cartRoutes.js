// routes/cart.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');

router.get('/', protect, getCart);           // GET /api/cart
router.post('/', protect, addToCart);        // POST /api/cart
router.put('/:itemId', protect, updateCartItem); // PUT /api/cart/:itemId
router.delete('/:itemId', protect, removeFromCart); // DELETE /api/cart/:itemId
router.delete('/', protect, clearCart);      // DELETE /api/cart

module.exports = router;