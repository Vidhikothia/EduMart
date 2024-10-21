import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBookForm.css'; 

const BookDetailsForm = () => {
  const [sellerId, setsellerId] = useState();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const sellerIdl = localStorage.getItem('sellerId');
    if (sellerIdl) {
        setsellerId(sellerIdl); 
    } else {
      setError('Seller not found ');
    }
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const bookData = new FormData(); 
    bookData.append('title', title);
    bookData.append('author', author);
    bookData.append('price', price);
    bookData.append('category', category);
    bookData.append('description', description);
    bookData.append('sellerId', sellerId);
    if (photo) bookData.append('photo', photo);

    try {
      const response = await fetch('http://localhost:5000/books/add', {
        method: 'POST',
        body: bookData,
      });
      if (response.status !== 201) {
        throw new Error('Failed to add book details');
      }

      const data = await response.json();
      console.log('Book details added successfully:', data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error during book details submission:', err);
      setError('Failed to submit book details. Please try again.');
    }
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <div className="book-details-form">
      <h1>Add Book Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Book Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price (Rs):</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Book Photo:</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button styletype="submit">Submit Book</button>
      </form>
    </div>
  );
};

export default BookDetailsForm;