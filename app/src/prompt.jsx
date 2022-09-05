import React from "react";

export default function PromptScreen() {
  const [toggle, setToggle] = React.useState(false);
  const promptRef = React.useRef(null);
  const seedRef = React.useRef(null);
  const iterRef = React.useRef(null);
  return (
    <div className="mx-auto max-w-md sm:max-w-3xl">
      <form
        className="mt-6 sm:flex sm:items-center"
        action="#"
        onSubmit={async (e) => {
          e.preventDefault();
          const prompt = promptRef.current.value;
          const seed = seedRef.current.value;
          console.log(prompt, seed);
          await window.api.createPrompt({ prompt, seed, key: `default` });
          promptRef.current.value = "";
          seedRef.current.value = "";
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
            placeholder="Enter your prompt here"
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
            Submit
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
