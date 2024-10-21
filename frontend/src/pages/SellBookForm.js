import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SellBookForm.css'; 

const SellBookForm = () => {
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [collegeName, setCollegeName] = useState('');
  const [city, setCity] = useState('');
  const [userId, setUserId] = useState(''); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId'); 
    console.log('Retrieved UserId from localStorage:', storedUserId); 

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('User not logged in.');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sellerData = { userId, phoneNumber, collegeName, city };
    console.log('Seller Data being sent:', sellerData);
    try {
      const response = await fetch('http://localhost:5000/users/seller/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellerData),
      });
      if (response.status !== 201) {
        throw new Error('Failed to add seller details');
      }

      const data = await response.json();
      console.log('Seller details added successfully:', data);

      navigate('/book-details-form');
    } catch (err) {
      console.error('Error during seller details submission:', err);
      setError('Failed to submit details. Please try again.');
    }
  };

  return (
    <div className="sell-book-card">
      <h1>Want to sell a Book!</h1><hr></hr><br></br>
      <p>We would like to have some extra information📝</p><br></br>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="collegeName">College Name:</label>
          <input
            type="text"
            id="collegeName"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button styletype="submit">Enter Book Details</button>
      </form>
    </div>
  );
};

export default SellBookForm;
