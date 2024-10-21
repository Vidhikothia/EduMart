
const express = require('express');
const router = express.Router();
const sellerRoutes = require('../routes/sellerRoutes');
const { register, login, getAllUsers, updateUser, deleteUser} = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.use('/seller',sellerRoutes);

router.get('/', getAllUsers); 
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser); 

module.exports = router;