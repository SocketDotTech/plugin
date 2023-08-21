import React from "react";
import ReactDom from "react-dom/client";
import { App } from "./App";
import "./style.css"

const root = ReactDom.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
