const Product = require('../models/Product');
const csv = require('csv-parser');
const fs = require('fs');

// @desc    Import products from CSV
// @route   POST /api/products/bulk-import
// @access  Private/Farmer
const importProductsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const results = [];
    const errors = [];

    // Process CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Process each product
        for (const product of results) {
          try {
            // Validate required fields
            if (!product.name || !product.price || !product.category) {
              errors.push({
                row: results.indexOf(product) + 1,
                error: 'Missing required fields'
              });
              continue;
            }

            // Create product
            await Product.create({
              farmer: req.user._id,
              name: product.name,
              description: product.description || '',
              price: parseFloat(product.price),
              category: product.category,
              stock: parseInt(product.stock) || 0,
              unit: product.unit || 'piece',
              isOrganic: product.isOrganic === 'true',
              images: product.images ? product.images.split(',') : [],
              status: 'active'
            });
          } catch (error) {
            errors.push({
              row: results.indexOf(product) + 1,
              error: error.message
            });
          }
        }

        // Delete uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
          success: true,
          data: {
            total: results.length,
            imported: results.length - errors.length,
            errors
          }
        });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Export products to CSV
// @route   GET /api/products/bulk-export
// @access  Private/Farmer
const exportProductsToCSV = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id });

    // Create CSV content
    let csvContent = 'name,description,price,category,stock,unit,isOrganic,images\n';
    products.forEach(product => {
      csvContent += `${product.name},${product.description},${product.price},${product.category},${product.stock},${product.unit},${product.isOrganic},${product.images.join(',')}\n`;
    });

    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');

    // Send CSV content
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update multiple products
// @route   PUT /api/products/bulk-update
// @access  Private/Farmer
const updateMultipleProducts = async (req, res) => {
  try {
    const { products } = req.body;
    const results = [];
    const errors = [];

    for (const product of products) {
      try {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: product._id, farmer: req.user._id },
          product,
          { new: true }
        );

        if (updatedProduct) {
          results.push(updatedProduct);
        } else {
          errors.push({
            productId: product._id,
            error: 'Product not found or not authorized'
          });
        }
      } catch (error) {
        errors.push({
          productId: product._id,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: {
        total: products.length,
        updated: results.length,
        errors
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete multiple products
// @route   DELETE /api/products/bulk-delete
// @access  Private/Farmer
const deleteMultipleProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    const results = [];
    const errors = [];

    for (const productId of productIds) {
      try {
        const product = await Product.findOneAndDelete({
          _id: productId,
          farmer: req.user._id
        });

        if (product) {
          results.push(productId);
        } else {
          errors.push({
            productId,
            error: 'Product not found or not authorized'
          });
        }
      } catch (error) {
        errors.push({
          productId,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: {
        total: productIds.length,
        deleted: results.length,
        errors
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  importProductsFromCSV,
  exportProductsToCSV,
  updateMultipleProducts,
  deleteMultipleProducts
}; 