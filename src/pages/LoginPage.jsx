import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerService from '../components/apiCalls/PlayerService';
import { AuthContext } from '../components/AuthContext'; // Import AuthContext
import '../css/LoginPage.css';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const playerApi = new PlayerService();
  const { login, setUser } = useContext(AuthContext); // Get login and setUser functions from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) {
      setError('Please enter both your name and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await playerApi.login({ name, password });
      if (response) {
        const { token } = response; // Extract token from the response
        login(token); // Call login function from AuthContext to set the user and save the token

        // Set token expiration to 1 hour
        setTimeout(() => {
          localStorage.removeItem('token');
          console.log('Token has been cleared');
        }, 3600000); // 3600000 milliseconds = 1 hour

        setName('');
        setPassword('');
        setLoading(false);
        navigate('/'); // Redirect to homepage
      }
    } catch (e) {
      setLoading(false);
      setError(
        e.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };

  const handleGuestPlay = () => {
    setUser(null); // Clear user context to indicate guest mode
    navigate('/choose-theme'); // Redirect to choose theme page
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-cy="login-username"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-cy="login-password"
        />
        <button type="submit" disabled={loading} data-cy="login-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>
        Don’t have an account?{' '}
        <button type="button" onClick={() => navigate('/register')} data-cy="register-button">
          Register here
        </button>
      </p>
      <div className="guest-play-container">
        <p>Want to explore without signing in?</p>
        <button type="button" onClick={handleGuestPlay} className="guest-play-button" data-cy="guest-play-button">
          Play as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
