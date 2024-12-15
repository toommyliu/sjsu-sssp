import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { PathfindingProvider } from "@/providers/pathfinding-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PathfindingProvider>
      <App />
    </PathfindingProvider>
    <Toaster />
  </React.StrictMode>,
);
