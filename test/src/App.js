import "./App.css";
import { Bridge } from "widget";

function App() {
  return (
    <div className="h-full bg-black">
        <Bridge />
        <button className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 text-base">
          Button
        </button>
    </div>
  );
}

export default App;
