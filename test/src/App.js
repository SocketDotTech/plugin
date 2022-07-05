import { Bridge } from "widget";
import { ethers } from "ethers";

function App() {
  const provider = ethers.getDefaultProvider();
  return (
    <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#121f34'}}>
      <Bridge provider={provider} API_KEY={process.env.REACT_APP_SOCKET_API_KEY}/>
    </div>
  );
}

export default App;
