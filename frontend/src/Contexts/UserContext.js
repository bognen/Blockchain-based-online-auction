import { createContext } from 'react';

export const UserContext = createContext({
  loggedIn: false,
  updated: false,
  email: null,
  account: null,
  token: null,
  tokenExpiresAt: null,
  setLoggedIn: () => {},
  setUpdated: () => {},
  setEmail: () => {},
  setAccount: () => {},
  setToken: () => {},
  setTokenExpiresAt: () => {},
});
