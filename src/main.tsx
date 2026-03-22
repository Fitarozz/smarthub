import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { OverlayEntry } from "./components/OverlayEntry";

const isOverlay = new URLSearchParams(window.location.search).get("overlay") === "true";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  isOverlay ? (
    <OverlayEntry />
  ) : (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ),
);
