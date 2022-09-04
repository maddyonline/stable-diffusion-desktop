import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Settings from "./settings";
import Prompt from "./prompt";

import "./index.css";

const container = document.getElementById("target");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="settings" element={<Settings />} />
        <Route path="invoices" element={<Prompt />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
