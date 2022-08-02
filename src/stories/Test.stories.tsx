import { Bridge } from "../index";
import { useEffect, useState } from "react";
import { SOCKET_API_KEY } from "../consts";
import { ethers } from "ethers";
import { WidgetProps } from "../types";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default {
  title: "Bridge",
  component: Bridge,
};

const Template = (args: WidgetProps) => {
  const [provider, setProvider] = useState<any>();
  const [userAddress, setUserAddress] = useState<string>();
  const [chain, setChain] = useState<number>();

  const fetchWalletData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const chain = await signer.getChainId();

    if (provider) {
      setProvider(provider);
      setUserAddress(userAddress);
      setChain(chain);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const chain = await signer.getChainId();
        setProvider(provider);
        setUserAddress(userAddress);
        setChain(chain);
      } else {
        alert("Web3 wallet not detected");
      }
    } catch (e) {
      alert("Error in connecting wallet");
      console.log(e);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      fetchWalletData();

      window.ethereum.on("chainChanged", () => {
        fetchWalletData();
      });

      window.ethereum.on("accountsChanged", () => {
        fetchWalletData();
      });
    }
  }, [window.ethereum]);

  return (
    <div className="bg-gray-400 p-10" style={{ height: "calc(100vh - 40px)" }}>
      <p style={{ color: "black" }}>
        User Address : {userAddress}
        <br />
        ChainId: {chain}
      </p>
      <div style={{ marginBottom: "30px" }}>
        {!userAddress && (
          <button
            onClick={connectWallet}
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              padding: "5px 12px",
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <Bridge {...args} provider={provider} />
    </div>
  );
};

const Customize = {
  secondary: "rgb(68,69,79)",
  primary: "rgb(31,34,44)",
  accent: "rgb(131,249,151)",
  onAccent: "rgb(0,0,0)",
  interactive: "rgb(0,0,0)",
  onInteractive: "rgb(240,240,240)",
  text: "rgb(255,255,255)",
  secondaryText: "rgb(200,200,200)",
  width: 400
};

const UNISWAP_DEFAULT_LIST = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";

export const Default = Template.bind({});
Default.args = {
  API_KEY: SOCKET_API_KEY,
  customize: Customize,
  // tokenList: MY_LIST,
  // tokenList: UNISWAP_DEFAULT_LIST,
  // destNetworks: [137],
  // sourceNetworks: [1, 137, 100],
  // defaultSourceNetwork: 10,
  // defaultDestNetwork: 10,
  // defaultSourceToken: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9", // susd
  // defaultDestToken: "0xdac17f958d2ee523a2206206994597c13d831EC7",
  // defaultDestToken: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
  // defaultSourceToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  // defaultDestToken: "0xbe662058e00849C3Eef2AC9664f37fEfdF2cdbFE",
  // defaultDestToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  // defaultDestToken: "0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9",
};
