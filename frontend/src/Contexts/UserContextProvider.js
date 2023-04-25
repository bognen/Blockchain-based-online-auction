import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';

function UserContextProvider({ children }) {

  const [loggedIn, setLoggedIn] = useState(() => {
    // Retrieve the logged in state from localStorage, or default to false
    const loggedInState = localStorage.getItem('loggedIn') === 'true';
    return loggedInState || false;
  });

  const [email, setEmail] = useState(() => {
    const emailValue = localStorage.getItem('email');
    return emailValue || null;
  });

  const [account, setAccount] = useState(() => {
    const accountValue = localStorage.getItem('account');
    return accountValue || null;
  });

  const [token, setToken] = useState(() => {
    const tokenValue = localStorage.getItem('token');
    return tokenValue || null;
  });

  const [tokenExpiresAt, setTokenExpiresAt] = useState(() => {
    const expiresAtValue = localStorage.getItem('tokenExpiresAt');
    return expiresAtValue || null;
  });

  // Check if token already expired
  useEffect(() => {
    if (tokenExpiresAt && tokenExpiresAt < Date.now()) {
      console.log(true)
      setToken(null);
      setEmail(null);
      setAccount(null);
      setLoggedIn(false);
      setTokenExpiresAt(null);
    }
  }, [tokenExpiresAt, setLoggedIn, setEmail, setAccount, setToken, setTokenExpiresAt]);

  // Save the states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn);
  }, [loggedIn]);

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem('account', account);
  }, [account]);

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem('tokenExpiresAt', tokenExpiresAt);
  }, [tokenExpiresAt]);

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        token,
        email,
        account,
        tokenExpiresAt,
        setLoggedIn,
        setToken,
        setEmail,
        setAccount,
        setTokenExpiresAt,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
