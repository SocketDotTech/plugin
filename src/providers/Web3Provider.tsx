import { createContext, useState } from "react";

interface web3ProviderTypes {
  userAddress: string;
  networkId: number | null;
  signer: any | null;
  provider: any | null;
}

interface ContextType {
  web3Provider: web3ProviderTypes | null;
  setweb3Provider: React.Dispatch<React.SetStateAction<web3ProviderTypes>>;
}

export const Web3Context = createContext<ContextType | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3Provider, setweb3Provider] = useState<web3ProviderTypes>({
    userAddress: "",
    networkId: null,
    signer: null,
    provider: null,
  });
  return (
    <Web3Context.Provider value={{ web3Provider, setweb3Provider }}>
      {children}
    </Web3Context.Provider>
  );
};
