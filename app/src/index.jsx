import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Settings from "./settings";
import Prompt from "./prompt";

import "./index.css";
import History from "./history";
import Gallery from "./gallery";
import Terminal from "./terminal";

const container = document.getElementById("target");
const root = createRoot(container);

root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Prompt />} />
        <Route path="prompt" element={<Prompt />} />
        <Route path="settings" element={<Settings />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="history" element={<History />} />
        <Route path="setup" element={<Terminal />} />
      </Route>
    </Routes>
  </HashRouter>
);
