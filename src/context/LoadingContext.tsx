import { createContext, useContext, useState } from "react";

interface LoadingContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const LoadingContext =
  createContext<LoadingContextType | null>(null);

export const LoadingProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{ loading, setLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context)
    throw new Error(
      "useLoading must be used inside provider"
    );
  return context;
};