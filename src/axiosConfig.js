import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Token may have expired.");
      // Optionally trigger a logout by clearing token
      localStorage.removeItem("token");
    }
    return Promise.reject(error); // Let the caller handle navigation or user feedback
  }
);

export default apiClient;
