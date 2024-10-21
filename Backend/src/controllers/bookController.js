const Book = require('../models/Book');
const Seller = require('../models/Seller');
const user = require('../models/User');
const path = require('path');
const fs = require('fs');

exports.addBook = async (req, res) => {
  try {
    const { title, author, price, category, description, sellerId } = req.body; 
    const photo = req.file ? req.file.path : null;
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    } 
    
    const newBook = new Book({
      title,
      author,
      price,
      category,
      photo: photo,
      description,
      seller: sellerId
    });  
      await newBook.save();
      seller.books.push(newBook._id);
      await seller.save();
      res.status(201).json({ 
        status: true,
        message: 'Book added successfully', 
        book:newBook.toObject({ getters: true })});
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ buyer: null })  
      .populate({
        path: 'seller',
        populate: {
          path: 'user',
          select: 'username',
        },
      })
      .select('title price photo category');

    const result = {
      books: books.map((book) => ({
        bookId: book._id,
        title: book.title,
        price: book.price,
        photo: book.photo,
        category: book.category,
        sellerId: book.seller._id,
        username: book.seller.user.username,
      })),
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId)
    .populate({
      path: 'seller', 
      populate: {
        path: 'user', 
        select: 'username email'
      }
    })

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const result = {
      bookId: book._id,
      title: book.title,
      price: book.price,
      photo: book.photo,
      description: book.description,
      category: book.category, 
      sellerId: book.seller._id,
      author:book.author, 
      username: book.seller.user.username,
      collegeName: book.seller.collegeName,
      email: book.seller.user.email,
      contact: book.seller.phoneNumber,
      buyer:book.buyer,
    };

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookBycategory = async (req, res) => {
  try {
    const category = String(req.query.category);
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    const books = await Book.find({ category }).populate({
      path: 'seller', 
      populate: {
        path: 'user', 
        select: 'username' 
      }
    }).select('title price photo');

    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found in this category' });
    }

    const result = books.map(book => ({
      bookId: book._id,
      title: book.title,
      price: book.price,
      photo: book.photo,
      sellerId: book.seller._id,
      username: book.seller.user.username 
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const sellerId = book.seller;
    await Book.findByIdAndDelete(bookId);

    await Seller.updateOne(
      { _id: sellerId }, 
      { $pull: { books: bookId } } 
    );

    res.status(200).json({ message: 'Book deleted successfully and seller updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, price, category, description } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.price = price || book.price;
    book.category = category || book.category;
    book.description = description || book.description;

    if (req.file) {
      
      if (book.photo) {
        const oldPhotoPath = path.join(__dirname, '../uploads', path.basename(book.photo));
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      
      book.photo = req.file.path.replace(/\\/g, '/'); 
    }

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getBooksByBuyerId = async (req, res) => {
  try {
    const { buyerId } = req.params; 
    const books = await Book.find({ buyer: buyerId }).populate({
      path: 'seller',
      populate: {
        path: 'user',
        select: 'username',
      },
    });

    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found for this buyer' });
    }

    res.status(200).json({
      message: 'Books retrieved successfully',
      books: books.map(book => ({
        bookId: book._id,
        title: book.title,
        photo: book.photo,
        category: book.category,
        price: book.price,
        sellerId: book.seller._id,
        username: book.seller.user.username,
      })),
    });
  } catch (error) {
    console.error('Error fetching books by buyerId:', error);
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

exports.purchaseBook = async (req, res) => {
  try {
    const { bookID } = req.params;
    const { buyerId } = req.body;  
    console.log(req.params);
    const book = await Book.findById(bookID);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.buyer) {
      return res.status(400).json({ message: 'Book has already been purchased' });
    }

    const buyer = await user.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    book.buyer = buyerId;
    await book.save();

    buyer.purchasedBooks.push(bookID);
    await buyer.save();

    res.status(201).json({
      message: 'Book purchased successfully',
      book: {
        bookId: book._id,
        title: book.title,
        price: book.price,
        buyer: buyer.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing purchase', error: error.message });
  }
};