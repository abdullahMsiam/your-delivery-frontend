import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Your Delivery",
    short_name: "Your Delivery",
    description:
      "Fast, reliable parcel delivery. Book, track, and pay for deliveries online.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      // Add these two if you generated PNGs from favicon.io:
      // { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      // { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
