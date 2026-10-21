import { createContext, useContext, useState } from 'react';
import { getCurrentUser, setCurrentUser, clearSession } from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  const login = (u) => {
    setCurrentUser(u);
    setUser(u);
  };
  const logout = () => {
    clearSession();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
