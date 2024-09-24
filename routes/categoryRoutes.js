const express = require('express');
const Category = require('../models/Category');
const multer = require('multer');
// const upload = require('../middleware/upload');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Create a new category with file uploads
router.post('/', upload.fields([{ name: 'profile_photo' }, { name: 'cover_photo' }]), async (req, res) => {
  try {
    console.log("Category Request ", req)
    const categoryData = {
      cat_title: req.body.cat_title,
      cat_description: req.body.cat_description,
      profile_photo: req.files['profile_photo'] ? req.files['profile_photo'][0].buffer.toString('base64') : null,
      cover_photo: req.files['cover_photo'] ? req.files['cover_photo'][0].buffer.toString('base64') : null,
    };
    const category = new Category(categoryData);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a category
router.put('/:id', upload.fields([{ name: 'profile_photo' }, { name: 'cover_photo' }]), async (req, res) => {
  try {
    const categoryData = {
      cat_title: req.body.cat_title,
      cat_description: req.body.cat_description,
      profile_photo: req.files['profile_photo'] ? req.files['profile_photo'][0].buffer.toString('base64'): undefined,
      cover_photo: req.files['cover_photo'] ? req.files['cover_photo'][0].buffer.toString('base64') : undefined,
    };
    const category = await Category.findByIdAndUpdate(req.params.id, categoryData, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
