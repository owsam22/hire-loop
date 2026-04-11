import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('hireloop_token');
        if (token) {
          const userData = await api.get('/auth/me');
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user session', error);
        localStorage.removeItem('hireloop_token');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('hireloop_token', data.token);
    setUser(data);
  };

  const register = async (userData) => {
    const data = await api.post('/auth/register', userData);
    localStorage.setItem('hireloop_token', data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('hireloop_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
