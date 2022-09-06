import React from "react";

export default function Trivial() {
  const [running, setRunning] = React.useState(false);
  const [progress, setProgress] = React.useState([
    {
      progress: { stdout: "This is where you will see the output of setup" },
      value: 1,
    },
  ]);
  React.useEffect(() => {
    if (!running) {
      return;
    }
    return window.api.listenTerminalProgress((e) => {
      console.log("received progress", e);
      setProgress([...progress, e]);
    });
  }, [running, progress, setProgress]);

  return (
    <>
      <div>
        This is an experimental setup module. We recommend running the setup
        script directly.
      </div>
      <div style={{ display: "flex" }}>
        <button
          onClick={async () => {
            window.api.openFolderWorkDir();
          }}
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        >
          See setup script
        </button>
        <button
          onClick={async () => {
            window.api.runSetup();
            setRunning(true);
          }}
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Run Setup
        </button>
      </div>
      <div className="w-full">
        <div
          className="coding inverse-toggle px-5 pt-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased 
               bg-gray-800  pb-6 rounded-lg leading-normal overflow-hidden"
        >
          <div className="top mb-2 flex">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <div className="ml-2 h-3 w-3 bg-orange-300 rounded-full"></div>
            <div className="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="mt-4 flex">
            <ul className="list-disc list-inside">
              {progress.map((p, index) => (
                <li key={index} className=" pl-2">
                  {JSON.stringify(p.progress)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
