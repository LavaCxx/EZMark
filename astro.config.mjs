import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import unocss from "@unocss/astro";
import AstroPWA from "@vite-pwa/astro";
// https://astro.build/config
export default defineConfig({
  integrations: [
    AstroPWA({
      injectRegister: true,
    }),
    solidJs(),
    unocss({
      injectReset: true,
    }),
  ],
});
