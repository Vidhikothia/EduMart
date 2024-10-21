import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import SellBookForm from './pages/SellBookForm';
import BookDetailsForm from './pages/AddBookForm';
import BookDetails from './pages/BookDetails';
import Order from './pages/order';

const App = () => {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/seller" element={<SellBookForm />} />
          <Route path="/books/add" element={<BookDetailsForm />} />
          <Route path="/books/:bookID" element={<BookDetails />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;