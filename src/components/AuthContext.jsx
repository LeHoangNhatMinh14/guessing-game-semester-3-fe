import React, { createContext, useState, useEffect } from "react";
import  { jwtDecode } from "jwt-decode"; // Correct way to import jwtDecode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded); // Debugging: Check if `id` is present
        setUser(extractUserData(decoded));
      }
    } catch (error) {
      console.error("Error decoding token from localStorage:", error);
    }
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(extractUserData(decoded));
      console.log("User logged in:", decoded);
    } catch (error) {
      console.error("Error decoding token and saving user:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      console.log("User logged out");
    } catch (error) {
      console.error("Error removing user from localStorage:", error);
    }
  };

  const extractUserData = (decodedToken) => {
    const { sub, role, id, iat, exp } = decodedToken;

    const simplifiedRole = role === "ROLE_ADMIN" ? "admin" : role.replace("ROLE_", "").toLowerCase();

    return {
      username: sub,
      id, // Correct reference to `id` from the decoded token
      role: simplifiedRole,
      issuedAt: iat,
      expiry: exp,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
