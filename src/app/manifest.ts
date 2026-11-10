import type { MetadataRoute } from "next";

/** Lets a phone add Deal Desk to the home screen and open it like an app, straight into the calculator. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deal Desk",
    short_name: "Deal Desk",
    description: "Enter what the dealer says. See in dollars where the money moved, and what to ask for next.",
    start_url: "/deal",
    scope: "/",
    display: "standalone",
    background_color: "#0e1a1f",
    theme_color: "#0e1a1f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
