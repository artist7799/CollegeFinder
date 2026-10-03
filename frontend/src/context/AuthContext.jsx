import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/authApi';

const AuthContext = createContext();

const TOKEN_KEY = 'collegefinder_token';
const USER_KEY = 'collegefinder_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(true);

  // Restore session on initial application load
  useEffect(() => {
    async function verifySession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        try {
          const res = await getCurrentUser(savedToken);
          if (res.data) {
            setUser(res.data);
            setToken(savedToken);
            localStorage.setItem(USER_KEY, JSON.stringify(res.data));
          } else {
            handleLogout();
          }
        } catch (err) {
          console.warn('Session restoration failed:', err.message);
          handleLogout();
        }
      } else {
        handleLogout();
      }
      setLoading(false);
    }

    verifySession();
  }, []);

  const handleLogin = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.data && res.data.access_token && res.data.user) {
      const authToken = res.data.access_token;
      const authUser = res.data.user;

      setToken(authToken);
      setUser(authUser);

      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      return authUser;
    }
    throw new Error('Invalid authentication response');
  };

  const handleRegister = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    return res;
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
