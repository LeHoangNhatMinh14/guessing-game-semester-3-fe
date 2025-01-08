import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerService from '../components/apiCalls/PlayerService';
import '../css/RegisterPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const playerApi = new PlayerService();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!name.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await playerApi.registerPlayer({ name, password });
      if (response) {
        setLoading(false);
        setError('Registration successful. You can now log in.');
        setName('');
        setPassword('');
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        setLoading(false);
        setError('Registration failed. Please try again.');
      }
    } catch (e) {
      setLoading(false);
      if (e.response && e.response.data && e.response.data.message) {
        setError(e.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RegisterPage;
