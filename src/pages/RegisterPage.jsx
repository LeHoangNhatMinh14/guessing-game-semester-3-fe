import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('/players', {
        name,
        password,
              });
      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/');
      }
    } catch (e) {
      console.error('An error occurred during registration', e);
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterPage;