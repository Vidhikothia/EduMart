const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  photo: { type: String },  
  description: { type: String },
  seller: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seller' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
});

module.exports = mongoose.model('Book', BookSchema);