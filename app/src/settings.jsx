import React from "react";
import useSWR, { useSWRConfig } from "swr";
import EditModal from "./edit.jsx";
import RestoreModal from "./restore.jsx";

export default function SettingsTable() {
  const [restoring, setRestoring] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const { mutate } = useSWRConfig();
  const { data: settings, error } = useSWR(
    "db/settings",
    async () => await window.api.fetchSettings()
  );
  if (error) return <div>failed to load</div>;
  if (!settings) return <div>loading...</div>;
  console.log({ settings });

  if (restoring) {
    return (
      <RestoreModal
        onDone={() => mutate("db/settings") && setRestoring(false)}
      />
    );
  }
  if (editing) {
    return (
      <EditModal
        editing={editing}
        onDone={() => mutate("db/settings") && setEditing(null)}
      />
    );
  }
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => setRestoring(true)}
          className="block rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Restore Defaults
        </button>

      </div>


      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Key
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Value
                    </th>

                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {settings.map((setting, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {setting.key}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {setting.value}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => setEditing(setting)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, {"test"}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
