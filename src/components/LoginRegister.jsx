import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const LoginRegister = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Remove user from localStorage and update state
    localStorage.removeItem('user');
    setIsLoggedIn(false);
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
