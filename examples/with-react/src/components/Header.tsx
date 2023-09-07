import { Network, ethers } from "ethers";
import { ReactNode, useEffect, useState } from "react";
import { LogOut } from "react-feather";

declare global {
  interface Window {
    ethereum: any;
  }
}

export const Header = ({
  upliftProvider,
}: {
  upliftProvider: (value: any) => void;
}) => {
  const [address, setAddress] = useState<string>("");
  const [provider, setProvider] = useState<any>(null);
  const [connectedNetwork, setConnectedNetwork] = useState<Network | null>();

  /**
   * Subscribing to networka and account change
   * Every time the network or account is changed, the above states will be udpated
   */
  useEffect(() => {
    if (window.ethereum) {
      connectWallet();

      window.ethereum.on("chainChanged", () => {
        connectWallet();
      });

      window.ethereum.on("accountsChanged", () => {
        connectWallet();
      });
    }
  }, []);

  useEffect(() => {
    upliftProvider(provider);
  }, [provider]);

  /** Connects to the injected wallet */
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // Getting the browser provider
        const _provider = new ethers.BrowserProvider(window.ethereum);
        /**
         * if using ethers v5, you can call the browser provider as follows
         * const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");
         */

        const signer = await _provider.getSigner();
        const _address = await signer.getAddress();
        const _network = await _provider.getNetwork();

        setConnectedNetwork(_network);
        setProvider(_provider);
        setAddress(_address);
      } else {
        alert("Injected Ethereum wallet not found");
      }
    } catch (e) {
      console.log("Error while connecting to the wallet", e);
    }
  };

  /** to shim disconnect wallet */
  const disconnectWallet = () => {
    setProvider(null);
    setAddress("");
  };

  const shortenAddress = (value: string) => {
    return value.slice(0, 6) + "..." + value.slice(-4);
  };

  return (
    <div className="flex justify-between items-center w-full px-7 border-b border-b-slate-300/10 h-[70px]">
      <p className="text-white font-medium text-lg">Socket Plugin</p>

      <div className="flex items-center">
        <a
          href="https://sockettech.notion.site/Socket-Widget-Docs-b905871870e343c6833169ebbd35fea6790"
          target="_blank"
          className="text-sm font-medium text-white hover:text-sky-400 mr-8"
        >
          Docs
        </a>
        {address ? (
          <Button onClick={disconnectWallet}>
            {connectedNetwork?.name}:{" "}
            <span className="text-slate-400 ml-1.5">
              {shortenAddress(address)}
            </span>
            <LogOut className="w-4 ml-2 text-red-400" />
          </Button>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </div>
    </div>
  );
};

const Button = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="capitalize rounded-md flex items-center bg-slate-400/10 px-3 font-medium text-sm highlight-white/5 text-white hover:bg-slate-400/20 h-9"
    >
      {children}
    </button>
  );
};
