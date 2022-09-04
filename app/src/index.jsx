import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Settings from "./settings";
import Prompt from "./prompt";

import "./index.css";
import History from "./history";

const container = document.getElementById("target");
const root = createRoot(container);

const TestApp = () => {
  const [filePath, setFilePath] = React.useState("");
  return (
    <>
      <h1>{`file path : ${filePath}`}</h1>
      <button
        onClick={async () => {
          const filePath = await window.api.openFile();
          console.log(filePath);
          setFilePath(filePath);
        }}
      >
        Open a File
      </button>
    </>
  );
};

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Prompt />} />
        <Route path="prompt" element={<Prompt />} />
        <Route path="settings" element={<Settings />} />
        <Route path="test" element={<TestApp />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
