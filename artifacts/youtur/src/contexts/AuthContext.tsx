import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  name: string;
  handle: string;
  avatar?: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Auto-login for mock app purposes
  useEffect(() => {
    setUser({
      name: "Alex",
      handle: "@youtur_ai",
      email: "alex@youtur.ai",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    });
  }, []);

  const login = (email: string) => {
    setUser({
      name: email.split('@')[0],
      handle: `@${email.split('@')[0]}`,
      email,
      avatar: `https://i.pravatar.cc/150?u=${email}`
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
