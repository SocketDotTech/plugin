import { Bridge } from "../index";
import { useEffect, useState } from "react";
import { SOCKET_API_KEY } from "../consts";
import { ethers } from "ethers";
import { WidgetProps } from "../utils/types";

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
    <div className="bg-gray-900 p-10" style={{ height: "calc(100vh - 40px)" }}>
      <p style={{ color: "white" }}>
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

export const Default = Template.bind({});
Default.args = {
  API_KEY: SOCKET_API_KEY,
  customize: {
    width: 360,
    responsiveWidth: false,
    borderRadius: 1,
  },
  sourceNetworks: [1, 10, 100, 137],
  destNetworks: [250, 1, 137, 10, 100],
  defaultSourceNetwork: 137,
  defaultDestNetwork: 10,
  sourceTokens: {
    137: [
      "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89",
      "0x50b728d8d964fd00c2d0aad81718b71311fef68a",
    ],
  },
  destTokens: {
    10: [
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "0x8700daec35af8ff88c16bdf0418774cb3d7599b4", // SNX
      "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
      "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
      "0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9", // SUSD
    ],
  },
  defaultSourceToken: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  defaultDestToken: "0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9",
};
