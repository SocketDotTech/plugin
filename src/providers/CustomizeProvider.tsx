import { defaultCustomisation } from "../consts/customisation";
import { createContext, useState } from "react";
import { Customize } from "../types";

type ContextProviderProps = {
  children: React.ReactNode;
};

interface ContextType {
  customization: Customize | null;
  setCustomization: React.Dispatch<React.SetStateAction<Customize>>;
}

export const CustomizeContext = createContext<ContextType | null>(null);

export const CustomizeProvider = ({ children }: ContextProviderProps) => {
  const [customization, setCustomization] = useState<Customize>(defaultCustomisation);
  return (
    <CustomizeContext.Provider value={{ customization, setCustomization }}>
      {children}
    </CustomizeContext.Provider>
  );
};
