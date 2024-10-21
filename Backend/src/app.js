const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require("./db/db");
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
// const smsRoutes = require('./routes/smsRoutes'); 

const path = require('path');
const app = express();
require('dotenv').config({ path: '../.env' });
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
// app.use('/api/send-sms', smsRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to EduMart!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
