import { createContext, ReactNode, useState, useContext } from "react";

interface AuthModalContextType {
  authModalIsOpen: boolean;
  setAuthModalIsOpen: (authModalIsOpen: boolean) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [authModalIsOpen, setAuthModalIsOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{ authModalIsOpen, setAuthModalIsOpen }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
