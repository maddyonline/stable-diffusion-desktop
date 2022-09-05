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

const ProgressBar = () => {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((progress) => {
        if (progress >= 100) {
          clearInterval(interval);
          return 0;
        }
        return progress + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <progress value={progress} max="100">
      {" "}
      {progress}{" "}
    </progress>
  );
};
const TestApp = () => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    return window.api.listenForProgress((e) =>
      console.log(`progress received: ${e}`)
    );
  }, []);
  return (
    <>
      <h1>{count}</h1>
      <ProgressBar />
      <button
        onClick={() => {
          window.api.run(`hello-${count}`);
          setCount(count + 1);
        }}
      >
        Run
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
