import React from "react";
import useSWR, { useSWRConfig } from "swr";

export default function Trivial() {
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
  console.log({ images });
  return <div className="bg-red-200">Hello from app</div>;
}
