import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('volunteer');
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if(storedUser && storedUser.role){
        setUser(storedUser);
        setIsAuthenticated(true);
        setRole(storedUser.role);
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      localStorage.removeItem('user');
    }
  }, []);
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role);
  };
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);