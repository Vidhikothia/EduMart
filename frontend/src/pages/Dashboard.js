import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Dashboard = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title');
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  useEffect(() => {
    const issellerl = localStorage.getItem('isseller'); 
    setIsSeller(issellerl);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/books/get')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.books) {
          setBooks(data.books);
        } else {
          throw new Error('Books data is not available');
        }
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setError('Error fetching books');
      });

    document.body.className = theme;

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [theme]);

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

  const filteredBooks = books
    .filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dashboard-container">
      <header className="header">
  <h1 className="logo">EduMart.</h1>
  <div className="hamburger" onClick={toggleMenu}>
    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
  </div>
  <div className={`header-links ${isMenuOpen ? 'open' : ''}`}>
    <a href="/order" className="link">Previous Orders</a>
    <a onClick={handleSellBookClick} className="link">Sell a Book!</a>
    <a onClick={handleGoToLogin} className="link">Logout</a>

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
          <h2>Hello, bookworm!</h2>
          <div className="search-sort-container">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bar"
            />
            <i className="fas fa-search search-icon"></i>
            <select value={sortOption} onChange={handleSortChange} className="sort-select">
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
          <div className="book-list">
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <div key={book.bookId} className="book-item" onClick={() => handleBookClick(book.bookId)}>
                  <img src={book.photo ? `http://localhost:5000/${book.photo.replace(/\\/g, '/')}` : 'image.png'} alt={book.title || 'Default Title'} className="book-image" />
                  <div className="book-details">
                    <h2 className="book-title">{book.title}</h2>
                    <p className="book-price">Rs {book.price ? `${book.price.toFixed(2)}` : 'Price not available'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No books available</p>
            )}
          </div>
        </div>
      </div>

      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop}>
          ↑ Back to Top
        </button>
      )}

      <footer className="footer">
        <p>&copy; 2024 EduMart. All rights reserved.</p>
        <p>Made with <span>❤️</span>| By Vidhi & Kruti</p>
      </footer>
    </div>
  );
};

export default Dashboard;
