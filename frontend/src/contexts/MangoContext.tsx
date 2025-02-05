import { createContext, useContext, useState, useEffect } from "react";
import { useGetUserOverviewByIdQuery } from "../generated/graphql-types";
import { useAuth } from "./AuthContext";

interface MangoContextType {
  mangoBalance: number;
  loading: boolean;
  error: Error | undefined;
  refetchMango: () => void;
}

const MangoContext = createContext<MangoContextType | undefined>(undefined);

export const MangoProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const {
    loading,
    error,
    data,
    refetch: refetchMango,
  } = useGetUserOverviewByIdQuery({
    variables: { id: userId || "" },
    skip: !userId,
  });
  const [mangoBalance, setMangoBalance] = useState<number>(0);

  useEffect(() => {
    if (data?.getUserOverviewById) {
      setMangoBalance(data.getUserOverviewById.user.mangoBalance);
    }
  }, [data]);

  return (
    <MangoContext.Provider
      value={{ mangoBalance, loading, error, refetchMango }}
    >
      {children}
    </MangoContext.Provider>
  );
};

export const useMango = () => {
  const context = useContext(MangoContext);
  if (!context) {
    throw new Error("useMango doit être utilisé dans un MangoProvider");
  }
  return context;
};
