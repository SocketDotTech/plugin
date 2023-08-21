import { Bridge } from "@socket.tech/plugin";
import { Header } from "./components/Header";

export const App = () => {
  return (
    <div className="bg-slate-900 h-screen">
      <Header />
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-5xl text-white font-semibold mb-6">
          Socket Plugin with React
        </h1>
        <p className="text-slate-400 mb-10">
          This example uses React, Tailwind CSS and Ethers v6
        </p>
        <Bridge
          API_KEY="72a5b4b0-e727-48be-8aa1-5da9d62fe635" // test api key
        />
      </div>
    </div>
  );
};
