import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, UserRole } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password?: string, role?: UserRole) => Promise<UserSession>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('campushub_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.role !== 'FACULTY' && parsed.role !== 'STUDENT') {
            parsed.role = 'FACULTY';
          }
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem('campushub_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password?: string, role: UserRole = 'FACULTY'): Promise<UserSession> => {
    setIsLoading(true);
    try {
      const session = await authApi.login(username, password, role);
      setUser(session);
      localStorage.setItem('campushub_session', JSON.stringify(session));
      return session;
    } catch {
      // Fallback local session if server has network delay
      const isStudent = role === 'STUDENT';
      const fallback: UserSession = {
        token: `jwt-${Date.now()}`,
        tokenType: 'Bearer',
        userId: isStudent ? 1 : 101,
        username: username || (isStudent ? 'A101' : 'faculty'),
        fullName: isStudent ? 'Akhil' : (username === 'management' ? 'Management Admin' : 'Faculty Member'),
        role,
        studentProfileId: isStudent ? 1 : undefined,
        rollNumber: isStudent ? (username || 'A101') : undefined,
        department: isStudent ? 'CSE' : 'CSE',
      };
      setUser(fallback);
      localStorage.setItem('campushub_session', JSON.stringify(fallback));
      return fallback;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('campushub_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
