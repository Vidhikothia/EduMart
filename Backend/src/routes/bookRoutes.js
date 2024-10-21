const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });
router.post('/add', upload.single('photo'), bookController.addBook);
router.put('/:bookId', upload.single('photo'), bookController.updateBook);
router.get('/get', bookController.getBooks);
router.get('/:bookId', bookController.getBookById);
router.get('/', bookController.getBookBycategory);
router.delete('/:bookId', bookController.deleteBook);

router.post('/purchase/:bookID', bookController.purchaseBook);
router.get('/buyer/:buyerId', bookController.getBooksByBuyerId);

module.exports = router;