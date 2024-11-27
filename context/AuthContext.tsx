import { createContext, useState, useContext } from 'react';

interface AuthContextType {
  user: { _id: string; email: string; role: string; fullName: string } | null;
  authToken: string | null;
  setUser: (user: { email: string; role: string; fullName: string; _id: string } | null) => void;
  setAuthToken: (token: string | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authToken: null,
  setUser: () => {},
  setAuthToken: () => {},
  setIsLoggedIn: () => {},
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; role: string; fullName: string; _id: string } | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ user, authToken, setUser, setAuthToken, setIsLoggedIn, isLoggedIn }}>
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