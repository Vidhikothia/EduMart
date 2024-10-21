const User = require('../models/User');
const Book = require('../models/Book');
const Seller = require('../models/Seller');

const addSeller = async (req, res) => {
  console.log(req.body); 
  try {
    const { userId, phoneNumber, collegeName, city } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingSeller = await Seller.findOne({ user: userId });
    if (existingSeller) {
      return res.status(400).json({ message: 'User is already a seller' });
    }

    const newseller = new Seller({
      user: userId,
      phoneNumber,
      collegeName,
      city,
      books: []
    });

    await newseller.save();
    await User.findByIdAndUpdate(userId, { isSeller: true });
    res.status(201).json({ message: 'Seller added successfully', seller: newseller.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ error: 'Error adding seller', details: error.message });
  }
};

const getallSeller = async (req, res) => {
    try {
      const sellers = await Seller.find()
        .populate('user', 'username email') 
        .populate('books', 'title');

      const result = sellers.map(seller => ({
        sellerId: seller._id,
        userId:seller.user._id,
        username: seller.user.username,
        email:seller.user.email,
        collegeName: seller.collegeName,
        phoneNumber: seller.phoneNumber, 
        photo: sellers.photo,
        books: seller.books.map(book => book.title) 
      }));

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const getSellerbyid = async (req, res) => {
  try {
    const { userId } = req.params;
    const seller = await Seller.findOne({ _id : userId })
      .populate('user', 'username email') 
      .populate('books', 'title price photo'); 

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const result = {
      sellerId: seller._id,
      username: seller.user.username,
      email: seller.user.email,
      phoneNumber: seller.phoneNumber,
      collegeName: seller.collegeName,
      city: seller.city,
      photo: seller.photo,
      books: seller.books.map(book => ({
        bookId: book._id,
        photo: book.photo,
        title: book.title,
        price: book.price
      }))
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSeller = async (req, res) => {
  try {
    const { userId } = req.params;

    const seller = await Seller.findOne({ _id: userId });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    await Book.deleteMany({ _id: { $in: seller.books } });

    await Seller.deleteOne({ _id: seller._id });
    await User.findByIdAndUpdate(seller.user, { isSeller: false });
    res.status(200).json({ message: 'Seller and associated books deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSeller = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, phoneNumber, collegeName, city } = req.body;

    const seller = await Seller.findOne({ _id: userId });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const user = await User.findById(seller.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    seller.phoneNumber = phoneNumber || seller.phoneNumber;
    seller.collegeName = collegeName || seller.collegeName;
    seller.city = city || seller.city;

    if (username) {
      user.username = username;
      await user.save(); 
    }
    if (req.file) {
      
      if (seller.photo) {
        const oldPhotoPath = path.join(__dirname, '../uploads', path.basename(book.photo));
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      
      book.photo = req.file.path.replace(/\\/g, '/'); 
    }


    await seller.save(); 

    const result = {
      sellerId: seller._id,
      username: user.username,
      phoneNumber: seller.phoneNumber,
      collegeName: seller.collegeName,
      photo:seller.photo,
      city: seller.city,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSellerByName = async (req, res) => {
  try {
    const name = String(req.query.username);
    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    const users = await User.find({ username: new RegExp(name, 'i') }); 

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const sellerIds = users.map(user => user._id);
    const sellers = await Seller.find({ user: { $in: sellerIds } })
      .populate('user', 'username email') 
      .populate('books', 'title'); 

    if (sellers.length === 0) {
      return res.status(404).json({ message: 'No sellers found' });
    }

    const result = sellers.map(seller => ({
      sellerId: seller._id,
      username: seller.user.username,
      collegeName: seller.collegeName,
      photo: seller.photo,
      books: seller.books.map(book => book.title) 
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSeller = updateSeller;
exports.deleteSeller = deleteSeller;
exports.getSellerbyid = getSellerbyid;
exports.getallSeller = getallSeller;
exports.addSeller = addSeller;
