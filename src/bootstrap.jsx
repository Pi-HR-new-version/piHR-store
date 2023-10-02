import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./store";

const root = document.createElement("div");
root.id = "root";

ReactDOM.createRoot(document.body.appendChild(root)).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
