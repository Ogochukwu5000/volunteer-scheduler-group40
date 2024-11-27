// context/AuthContext.tsx
import { createContext, useState, useContext } from 'react';

interface AuthContextType {
  user: { email: string; role: string; fullName: string } | null;
  authToken: string | null;
  setUser: (user: { email: string; role: string; fullName: string } | null) => void;
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

export const useAuth = () => useContext(AuthContext);

// Export the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ email: string; role: string; fullName: string } | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Provide the context values to the children components
  return (
    <AuthContext.Provider value={{ user, authToken, setUser, setAuthToken, setIsLoggedIn, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};