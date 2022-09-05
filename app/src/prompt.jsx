import React from "react";

/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { PlusIcon } from "@heroicons/react/20/solid";
import Gallery from "./gallery";

const people = [
  {
    name: "Lindsay Walton",
    role: "Front-end Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Courtney Henry",
    role: "Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Tom Cook",
    role: "Director, Product Development",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Whitney Francis",
    role: "Copywriter",
    imageUrl:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Leonard Krasner",
    role: "Senior Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Floyd Miles",
    role: "Principal Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export default function PromptScreen() {
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
          {/* create a row flex of inputs */}
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
        </div>

        <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
          <button
            type="submit"
            className="block w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
