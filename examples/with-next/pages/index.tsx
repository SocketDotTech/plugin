import type { NextPage } from "next";
import { Header } from "../components/Header";
import dynamic from "next/dynamic";
import { useNetwork } from "wagmi";
import { useEthersSigner } from "../adapters/useEthersSigner";

/**
 * Socket Plugin references localStorage.
 * Since Next js renders the components on the server, the code that references localStorage
 * is being executed on the server, where localStorage is not available
 * 
 * Hence Plugin is imported dynamically
 */
const DynamicBridge = dynamic(
  // @ts-ignore
  () => import("@socket.tech/plugin").then((mod) => mod.Bridge),
  {
    ssr: false,
  }
);


const Home: NextPage = () => {
  const {chain} = useNetwork()
  const signer = useEthersSigner({chainId: chain?.id});
  const provider = signer?.provider;

  return (
    <div className="bg-slate-900 h-screen flex flex-col justify-between">
      <div>
        <Header />
        <div className="flex flex-col items-center mt-10">
          <h1 className="text-5xl text-white font-semibold mb-6">
            Socket Plugin <span className="text-sky-500">+</span> NextJs{" "}
            <span className="text-sky-500">+</span> Rainbowkit{" "}
            <span className="text-sky-500">+</span> Wagmi
          </h1>
          <p className="text-slate-400 mb-10">
            This example uses Nextjs, Tailwind CSS, Wagmi, Viem and Rainbowkit
          </p>
          <DynamicBridge
            API_KEY="72a5b4b0-e727-48be-8aa1-5da9d62fe635" // test api key
            provider={provider}
          />
        </div>
      </div>
      <footer className="text-gray-200 text-center p-6">
        <a href="http://socket.tech/" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your frens at Socket
        </a>
      </footer>
    </div>
  );
};

export default Home;
