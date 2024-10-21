import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Order = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title');
  const [buyerID, setUserId] = useState('');
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const issellerl = localStorage.getItem('isseller');
    setIsSeller(issellerl);

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }

    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    if (buyerID) {
      fetch(`http://localhost:5000/books/buyer/${buyerID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.books) {
            setBooks(data.books);
          } else {
            throw new Error('Books data is not available');
          }
        })
        .catch((error) => {
          console.error('Error fetching books:', error);
          setError('Error fetching books');
        });
    }
  }, [buyerID]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  const handleSellBookClick = () => {
    if (isSeller === 'true') {
      navigate('/books/add');
    } else {
      navigate('/seller');
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const filteredBooks = books
    .filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="logo">EduMart.</h1>
        <div className="header-links">
          <a className="link" href="/dashboard">Home</a>
          <a className="link" onClick={handleSellBookClick}>Sell a Book!</a>
          <a className="link" onClick={handleGoToLogin}>Logout</a>

          <div className="theme-toggle-container" onClick={toggleTheme}>
            {theme === 'light' ? <span className="emoji">🌙</span> : <span className="emoji">☀️</span>}
            <div className={`toggle-switch ${theme === 'light' ? 'light' : 'dark'}`}>
              <div className="toggle-handle"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="content">
          <h2>Previous Orders</h2>
          <div className="search-sort-container">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bar"
            />
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
          <div className="book-list">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div
                  key={book.bookId}
                  className="book-item"
                  onClick={() => handleBookClick(book.bookId)}
                >
                  <img
                    src={
                      book.photo
                        ? `http://localhost:5000/${book.photo.replace(/\\/g, '/')}`
                        : 'image.png'
                    }
                    alt={book.title || 'Default Title'}
                    className="book-image"
                  />
                  <div className="book-details">
                    <h2 className="book-title">{book.title}</h2>
                    <p className="book-price">
                      Rs {book.price ? `${book.price.toFixed(2)}` : 'Price not available'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No books ordered yet</p>
            )}
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <p>&copy; 2024 EduMart. All rights reserved.</p>
        <p>Made with <span>❤️</span>| By Vidhi & Kruti</p>

      </footer>
    </div>
  );
};

export default Order;
