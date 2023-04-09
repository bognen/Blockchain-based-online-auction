import { createContext } from 'react';

export const UserContext = createContext({
  loggedIn: false,
  token: null,
  tokenExpiresAt: null,
  setLoggedIn: () => {},
  setToken: () => {},
  setTokenExpiresAt: () => {},
});
