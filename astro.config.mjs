import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import unocss from "@unocss/astro";
// https://astro.build/config
export default defineConfig({
  integrations: [
    solidJs(),
    unocss({
      injectReset: true,
    }),
  ],
});
