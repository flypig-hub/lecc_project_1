import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const value = useMemo(
    () => ({
      token,
      setToken: (newToken) => {
        if (!newToken) {
          localStorage.removeItem('token');
          setToken(null);
          return;
        }
        localStorage.setItem('token', newToken);
        setToken(newToken);
      }
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
