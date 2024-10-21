const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

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

router.post('/add', sellerController.addSeller);
router.get('/get', sellerController.getallSeller);
router.get('/:userId',sellerController.getSellerbyid);
router.delete('/:userId',sellerController.deleteSeller);
router.put('/:userId', upload.single('photo'),sellerController.updateSeller);

module.exports = router;
