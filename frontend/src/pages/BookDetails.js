import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookDetails.css';

const BookDetails = () => {
  const { bookID } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [buyerId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/books/${bookID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        if (!data) {
          throw new Error('No book found with this ID');
        }
        setBook(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBookDetails();
  }, [bookID]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId'); 
    if (storedUserId) {
      setUserId(storedUserId); 
    }
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  const handleBuyBook = async () => {
    alert(`You have chosen to buy "${book.title}"!`);

    const smsData = {
      phoneNumber: book.contact,
      bookDetails: {
        title: book.title,
        author: book.author,
        price: book.price,
        description: book.description,
        username: book.username,
        contact: book.contact,
      },
    };

    try {
      const response = await fetch(`http://localhost:5000/books/purchase/${bookID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buyerId }),
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Error during seller details submission:', err);
    }
  };

  return (
    <div className="book-details-page">
      <header>
        <button onClick={() => navigate(-1)} className="backbutton">
        ←
        </button>
      </header>
      <div className="book-details-container">
        <div className="book-photo">
          <img
            src={book.photo ? `http://localhost:5000/${book.photo.replace(/\\/g, '/')}` : 'image.png'}
            alt={book.title}
            className="book-image"
          />
        </div>
        <div className="book-detail">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-price">
            <b>Price:</b> Rs {book.price ? `${book.price.toFixed(2)}` : 'Price not available'}
          </p>
          <p className="book-author"><b>Author:</b> <i>{book.author || 'Unknown Author'}</i></p>
          <p className="book-description"><b>Description:</b> {book.description || 'No description available'}</p>
          <p className="book-seller"><b>Seller:</b> {book.username || 'Seller information not available'}</p>
          <p className="book-seller"><b>Email: </b>{book.email || 'Email not available'}</p>
          <p className="book-seller-phone"><b>Contact:</b> {book.contact || 'No contact info available'}</p>
          <button className="buy-book-button" onClick={handleBuyBook}>Contact seller to Buy Book</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
