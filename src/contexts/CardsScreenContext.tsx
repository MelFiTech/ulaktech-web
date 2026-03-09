"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export interface CardsScreenContextValue {
  isNewUserState: boolean;
  setIsNewUserState: (value: boolean) => void;
}

const CardsScreenContext = createContext<CardsScreenContextValue | null>(null);

export function CardsScreenProvider({ children }: { children: React.ReactNode }) {
  const [isNewUserState, setIsNewUserStateState] = useState(false);

  const setIsNewUserState = useCallback((value: boolean) => {
    setIsNewUserStateState(value);
  }, []);

  return (
    <CardsScreenContext.Provider
      value={{
        isNewUserState,
        setIsNewUserState,
      }}
    >
      {children}
    </CardsScreenContext.Provider>
  );
}

export function useCardsScreen(): CardsScreenContextValue {
  const value = useContext(CardsScreenContext);
  if (!value) {
    throw new Error("useCardsScreen must be used within CardsScreenProvider");
  }
  return value;
}

export function useCardsScreenOptional(): CardsScreenContextValue | null {
  return useContext(CardsScreenContext);
}
