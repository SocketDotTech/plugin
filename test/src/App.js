// import "./App.css";
import { Bridge } from "widget";
import {ethers} from "ethers"

function App() {
  const provider = ethers.getDefaultProvider();
  return (
    <div className="h-full bg-black">
      <Bridge />
    </div>
  );
}

export default App;
