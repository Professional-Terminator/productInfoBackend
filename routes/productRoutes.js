const express = require('express');
const Product = require('../models/Product');
const upload = require('../middleware/upload'); // Assuming you have an upload middleware
const upload = multer({ storage: multer.memoryStorage() });


const router = express.Router();

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const productData = {
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.buffer.toString('base64') : null,
      categoryId: req.body.categoryId,
    };
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId'); // Populate category data
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const productData = {
      title: req.body.title,
      description: req.body.description,
      categoryId: req.body.categoryId,
    };
    if (req.file) {
      productData.image = req.file.buffer.toString('base64'); // Update image if uploaded
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category ID
router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ categoryId: req.params.categoryId }).populate('categoryId');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
