import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const Homepage = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="homepage">
      <h1>Welcome to EduMart</h1><br></br>
      <button className="go-to-login" onClick={handleGoToLogin}>
        <span className="arrow">&#8595;</span> Login
      </button>&nbsp;&nbsp;
      <button className="go-to-signup" onClick={handleGoToSignup}>
        <span className="arrow">&#8595;</span> SignUp
      </button>
    </div>
  );
};

export default Homepage;
