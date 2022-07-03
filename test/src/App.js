// import "./App.css";
import { Bridge } from "widget";
import { ethers } from "ethers";

function App() {
  const provider = ethers.getDefaultProvider();
  return (
    <div className="h-full bg-black">
      Salil
      <Bridge provider={provider} customize={{width: 400}}/>
    </div>
  );
}

export default App;
