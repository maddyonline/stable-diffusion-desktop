import React from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 text-center sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Ready to give it a spin?</span>
          <span className="block">The full app is open source.</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Link
              to="/contact"
              onClick={() => {
                window.api.openLinkGithub();
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
            >
              Get involved
            </Link>
          </div>
          <div className="ml-3 inline-flex">
            <Link
              to="/contact"
              onClick={() => {
                window.api.openLinkTwitter();
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-5 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200"
            >
              Reach out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
