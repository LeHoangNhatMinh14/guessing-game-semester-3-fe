import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../axiosConfig";

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storeUserData = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) {
      setError('Please enter both your name and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/players/login', { name, password });
      if (response.status === 200 && response.data) {
        const { token, user } = response.data;
        storeUserData(token, user);

        setName('');
        setPassword('');
        setLoading(false);
        navigate('/');
      } else {
        setLoading(false);
        setError('Invalid credentials. Please try again.');
      }
    } catch (e) {
      setLoading(false);
      if (e.response) {
        if (e.response.status === 403) {
          setError('Access forbidden. Please check your credentials.');
        } else if (e.response.data && e.response.data.message) {
          setError(e.response.data.message);
        } else {
          setError('An error occurred. Please try again.');
        }
      } else if (e.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
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
