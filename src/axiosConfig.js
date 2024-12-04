import axios from 'axios';

// Set the base URL for all requests
axios.defaults.baseURL = 'http://localhost:8080';

// Create an interceptor to add the Authorization header with the token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request Headers:', config.headers); // Log headers
    return config;
  },
  (error) => Promise.reject(error)
);


// Optional: Create a response interceptor to handle 401 errors (e.g., when the token is expired)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear any existing token since it is no longer valid
      localStorage.removeItem('token');
      // Redirect user to the login page for re-authentication
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
