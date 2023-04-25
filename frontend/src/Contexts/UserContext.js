import { createContext } from 'react';

export const UserContext = createContext({
  loggedIn: false,
  email: null,
  account: null,
  token: null,
  tokenExpiresAt: null,
  setLoggedIn: () => {},
  setEmail: () => {},
  setAccount: () => {},
  setToken: () => {},
  setTokenExpiresAt: () => {},
});
