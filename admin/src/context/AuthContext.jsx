import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const rol = localStorage.getItem('rol');
    if (token && rol) {
      setUser({ token, rol });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, rol } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('rol', rol);
    setUser({ token: accessToken, rol });
    return rol;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('rol');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);