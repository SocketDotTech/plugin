import React, { useEffect, useState } from "react";
import { storiesOf } from "@storybook/react";
import { Bridge } from "../index.tsx";
import "./style.css";
import { SOCKET_API_KEY } from "../consts";
import { ethers } from "ethers";

const stories = storiesOf("Socket Widget", module);

stories.add("Widget", () => {
  const [provider, setProvider] = useState();
  const [userAddress, setUserAddress] = useState();
  const [chain, setChain] = useState();

  const fetchWalletData = async () => {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum,
      "any"
    );
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const chain = await signer.getChainId();

    if (provider) {
      setProvider(provider);
      setUserAddress(userAddress);
      setChain(chain);
    }
    else {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const chain = await signer.getChainId();
      setProvider(provider);
      setUserAddress(userAddress);
      setChain(chain);
    }
  }

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        fetchWalletData();
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

      ethereum.on('chainChanged', () => {
        fetchWalletData();
      });

      ethereum.on('accountsChanged', () => {
        fetchWalletData();
      });
    }
  }, [window.ethereum])


  useEffect(() => {
    console.log('Provider in Stories', provider, userAddress)
  }, [provider])


  return (
    <div
      style={{
        height: "calc(100vh - 40px)",
        backgroundColor: "#222",
        padding: "40px",
      }}
    >
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
      {
        provider && (<Bridge
          provider={provider}
          API_KEY={SOCKET_API_KEY}
          customize={{ borderRadius: 1 }}
        />)
      }

    </div>
  );
});
