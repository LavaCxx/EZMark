import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import unocss from "@unocss/astro";
import AstroPWA from "@vite-pwa/astro";
// https://astro.build/config
export default defineConfig({
  integrations: [
    AstroPWA({
      injectRegister: true,
      registerType: 'autoUpdate',
      manifest: {
        name: "EZMark",
        short_name: "EZMark",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        start_url: "/",
        display: "standalone",
        background_color: "#f3eeea",
        theme_color: "#776b5d",
        description: "A more convenient method of adding Leica-like watermarks",
      },
    }),
    solidJs(),
    unocss({
      injectReset: true,
    }),
  ],
});
