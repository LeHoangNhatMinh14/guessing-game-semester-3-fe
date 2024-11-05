import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../axiosConfig";

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) {
      setError('Please enter both your name and password.');
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post('/login', { name, password });
      if (response.status === 200 && response.data) {
        const data = response.data;
        localStorage.setItem('user', JSON.stringify(data));
        setLoading(false);
        navigate('/');
      } else {
        setLoading(false);
        setError('Invalid credentials. Please try again.');
      }
    } catch (e) {
      setLoading(false);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LoginPage;
