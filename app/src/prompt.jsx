import React from "react";

import { DEFAULT_PROMPT } from "./utils";

const ProgressBar = ({ progress, max }) => {
  return (
    <progress value={progress} max={max}>
      {" "}
      {progress}{" "}
    </progress>
  );
};

export default function PromptScreen() {
  const [running, setRunning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [toggle, setToggle] = React.useState(false);
  const promptRef = React.useRef(null);
  const seedRef = React.useRef(null);
  const iterRef = React.useRef(null);

  React.useEffect(() => {
    if (!running) {
      return;
    }
    return window.api.listenForProgress((e) => {
      console.log("received progress", e);
      setProgress(e.progress.iterations);
    });
  }, [running]);

  React.useEffect(() => {
    if (running && progress >= 4) {
      setRunning(false);
      setProgress(0);
    }
  }, [running, progress]);
  return (
    <div className="mx-auto max-w-md sm:max-w-3xl">
      {running && <ProgressBar progress={progress} max={4} />}
      <form
        className="mt-6 sm:flex sm:items-center"
        action="#"
        onSubmit={async (e) => {
          e.preventDefault();
          const prompt = promptRef.current?.value || DEFAULT_PROMPT;
          const seed = seedRef.current?.value || 42;
          const iterations = iterRef.current?.value || 4;
          // replace space with hyphens in prompt and shorten to 20 chars
          const promptSlug = prompt.replace(/\s/g, "-").slice(0, 20);
          const key = `${promptSlug}-${seed}-${iterations}`;
          console.log({ prompt, seed, iterations, key });
          await window.api.createPrompt({ prompt, seed, iterations, key });
          window.api.run({ prompt, seed, iterations, key });
          setRunning(true);

          const reset = (ref) => {
            if (ref.current) {
              ref.current.value = "";
            }
          };
          reset(promptRef);
          reset(seedRef);
          reset(iterRef);
        }}
      >
        <label htmlFor="prompt" className="sr-only">
          Prompt
        </label>
        <div className="relative rounded-md shadow-sm sm:min-w-0 sm:flex-1">
          <input
            ref={promptRef}
            type="text"
            name="prompt"
            id="prompt"
            className="block w-full rounded-md border-gray-300 pr-32 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder={`Enter your prompt here, e.g, ${DEFAULT_PROMPT}`}
          />
          {toggle && (
            <div className="flex">
              <input
                ref={seedRef}
                type="text"
                name="seed"
                id="seed"
                className="block w-full rounded-md border-gray-300 pr-32 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="seed (default: random)"
              />
              <input
                ref={iterRef}
                type="text"
                name="iter"
                id="iter"
                className="block w-full rounded-md border-gray-300 pr-32 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="iterations (default: 4)"
              />
            </div>
          )}
        </div>

        <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
          <button
            type="submit"
            className="block w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {!running && "Submit"}
            {running && (
              <svg
                className="animate-spin h-5 w-5 mr-3 bg-black"
                viewBox="0 0 24 24"
              ></svg>
            )}
          </button>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
          <button
            onClick={() => setToggle(!toggle)}
            className="block w-full rounded-md border border-transparent bg-gray-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {toggle ? "-" : "+"}
          </button>
        </div>
      </form>
    </div>
  );
}
