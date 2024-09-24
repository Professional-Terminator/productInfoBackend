const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  cat_title: { type: String, required: true },
  profile_photo: { type: String },
  cover_photo: { type: String },
  cat_description: { type: String },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Category', categorySchema);
