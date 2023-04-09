import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';

function UserContextProvider({ children }) {

  const [loggedIn, setLoggedIn] = useState(() => {
    // Retrieve the logged in state from localStorage, or default to false
    const loggedInState = localStorage.getItem('loggedIn') === 'true';
    return loggedInState || false;
  });

  const [token, setToken] = useState(() => {
    // Retrieve the token from localStorage, or default to null
    const tokenValue = localStorage.getItem('token');
    return tokenValue || null;
  });

  const [tokenExpiresAt, setTokenExpiresAt] = useState(() => {
    // Retrieve the token expiration time from localStorage, or default to null
    const expiresAtValue = localStorage.getItem('tokenExpiresAt');
    return expiresAtValue || null;
  });

  // Check if token already expired
  useEffect(() => {
    if (tokenExpiresAt && tokenExpiresAt < Date.now()) {
      setToken(null);
      setLoggedIn(false);
      setTokenExpiresAt(null);
    }
  }, [tokenExpiresAt, setLoggedIn, setToken, setTokenExpiresAt]);

  // Save the states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn);
  }, [loggedIn]);

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem('tokenExpiresAt', tokenExpiresAt);
  }, [tokenExpiresAt]);

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        token,
        tokenExpiresAt,
        setLoggedIn,
        setToken,
        setTokenExpiresAt,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
