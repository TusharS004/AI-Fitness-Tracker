// src/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create an Auth context
const AuthContext = createContext();

// Create a provider component that will wrap around your app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already authenticated by checking for an auth token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Done loading, now you can render the app
  }, []);

  // Provide the context value to the children components
  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication context values
export const useAuth = () => useContext(AuthContext);
