import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const LoginRegister = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Update login status based on token presence
  }, []);

  const handleLogout = () => {
    // Remove the token from localStorage and update state
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // Optionally, redirect to the home or login page
    window.location.href = '/';
  };

  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Link to="/login">
            <button style={{ marginRight: '10px' }}>Login</button>
          </Link>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default LoginRegister;
