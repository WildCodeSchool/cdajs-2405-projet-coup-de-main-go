import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface UserContextType {
  userId: string | null;
  setUserId: (id: string) => void;
  clearUserId: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const COOKIE_NAME = 'userId';
const COOKIE_OPTIONS = {
  expires: 30, // 30 days
  secure: true,
  sameSite: 'strict' as const,
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(() => {
    return Cookies.get(COOKIE_NAME) || null;
  });

  const setUserId = (id: string) => {
    Cookies.set(COOKIE_NAME, id, COOKIE_OPTIONS);
    setUserIdState(id);
  };

  const clearUserId = () => {
    Cookies.remove(COOKIE_NAME);
    setUserIdState(null);
  };

  useEffect(() => {
    const cookieUserId = Cookies.get(COOKIE_NAME);
    if (cookieUserId && userId !== cookieUserId) {
      setUserIdState(cookieUserId);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId, clearUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}