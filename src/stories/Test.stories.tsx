import { Bridge } from "../index";
import { useEffect, useState } from "react";
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
  const [showBridge, setToggleBridge] = useState<boolean>(true);

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

  const _destNetworks = [chain];
  const _defaultDestNetwork = _destNetworks[0];

  return (
    <div
      className="skt-w skt-w-bg-gray-400 skt-w-p-10"
      style={{ height: "calc(100vh - 40px)" }}
    >
      <p style={{ color: "black" }}>
        User Address : {userAddress}
        <br />
        ChainId: {chain}
      </p>
      <button onClick={() => setToggleBridge(!showBridge)}>
        Toggle Bridge
      </button>
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
      {showBridge && (
        <Bridge
          {...args}
          provider={provider}
          // defaultDestNetwork={_defaultDestNetwork}
          // destNetworks={_destNetworks}
          // feeParams={{feePercent: 2.5, feeTakerAddress: ''}}
        />
      )}
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
  borderRadius: 1
  // fontFamily: '"Comic Sans MS", cursive'
  // width: 400
};
const darkTheme = {
  secondary: 'rgb(37,42,46)',
  primary: 'rgb(24,28,31)',
  accent: 'rgb(120,79,254)',
  onAccent: 'rgb(255, 255, 255)',
  interactive: 'rgb(37,42,46)',
  onInteractive: 'rgb(255,255,255)',
  text: 'rgb(255,255,255)',
  secondaryText: 'rgb(199,210,218)',
  fontFamily: "'Inter', sans-serif",
  borderRadius: 1,
};

function showAlert(value) {
  console.log("showing alert", value);
}

const UNISWAP_DEFAULT_LIST = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";
const displayName = <span style={{ color: "red" }}>Salil</span>;

const devApiKey = '763569fb-e53b-4edb-8067-13240d1614b6';
const prodApiKey = '72a5b4b0-e727-48be-8aa1-5da9d62fe635';

export const Default = Template.bind({});
Default.args = {
  API_KEY: prodApiKey,
  customize: Customize,
  enableSameChainSwaps: true,
  // title: [displayName],
  // includeBridges: ['hyphen'],
  singleTxOnly: true,
  // excludeBridges: ['hop', 'polygon-bridge'],
  enableRefuel: true,
  // onBridgeSuccess: showAlert,
  // onSourceTokenChange: (value) => console.log('Source Token:', value),
  // onSourceNetworkChange: (value) => console.log('Source Network:', value),
  // onDestinationTokenChange: (value) => console.log('Dest Token:', value),
  // onDestinationNetworkChange: (value) => console.log('Dest Network:', value),
  // onError: (value) => console.log('Error', value),
  // onSubmit: (value: transactionDetails) => console.log('Submitted: ', value, value?.txData?.[0]?.chainId),

  // tokenList: MY_LIST,
  // tokenList: UNISWAP_DEFAULT_LIST,
  // destNetworks: [10],
  // sourceNetworks: [42161, 10],
  // defaultSourceNetwork: defaultDestNw,
  // defaultDestNetwork: 42161,
  // defaultSourceToken: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9", // susd
  // defaultDestToken: "0xdac17f958d2ee523a2206206994597c13d831EC7",
  // defaultDestToken: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
  // defaultSourceToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  // defaultDestToken: "0x374ad0f47f4ca39c78e5cc54f1c9e426ff8f231a",
  // defaultDestToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  // defaultDestToken: "0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9",
  // defaultDestNetwork: 10,
  // defaultSourceNetwork: 10,
};
