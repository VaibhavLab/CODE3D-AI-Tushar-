import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, demoUserLogin } from '../services/apiService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('code3d_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('code3d_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('code3d_user');
    }
  }, [user]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res && res.success) {
      setUser(res);
      return { success: true };
    }
    return { success: false, message: res?.message || 'Login failed' };
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res && res.success) {
      setUser(res);
      return { success: true };
    }
    return { success: false, message: res?.message || 'Registration failed' };
  };

  const loginAsDemo = async () => {
    const res = await demoUserLogin();
    if (res && res.success) {
      setUser(res);
    } else {
      setUser({
        id: 1,
        username: 'himanshu',
        email: 'himanshu@code3d.edu',
        fullName: 'Himanshu (Lead Architect)',
        role: 'Lead Architect',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        token: 'code3d_demo_token'
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginAsDemo,
        logout,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
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
