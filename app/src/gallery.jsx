import React from "react";
import useSWR, { useSWRConfig } from "swr";

export default function Gallery() {
  const { mutate } = useSWRConfig();
  const { data: images, error } = useSWR(
    "latest-images",
    async () => await window.api.fetchImages()
  );
  if (error) {
    console.error(error);
    return <div>Failed to load images</div>;
  }
  if (!images) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Recent Images
        </h2>
        <button onClick={() => mutate("latest-images")}>Refresh</button>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {images &&
            images.map((image, index) => (
              <div key={index} className="group relative">
                <div
                  onClick={() => window.api.openFolder()}
                  className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80"
                >
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt={"Image Alt"}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                {/* <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a onClick={() => window.api.openFolder()}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {"Cool Hat"}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{"red"}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {"seed 3"}
                  </p>
                </div> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
