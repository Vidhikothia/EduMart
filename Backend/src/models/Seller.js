const mongoose = require('mongoose');
const Book = require('./Book'); 

const SellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  phoneNumber: { type: String, required: true },
  collegeName: { type: String, required: true },
  city: { type: String, required: true },
  photo: { type: String },
  books: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Book'}]
});

module.exports = mongoose.model('Seller', SellerSchema);
