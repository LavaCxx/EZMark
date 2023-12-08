import { defineConfig } from "unocss";

import presetWind from "@unocss/preset-wind";
export default defineConfig({
  presets: [presetWind()],

  theme: {
    colors: {
      blank: "var(--blank-color)",
      base: "var(--base-color)",
      primary: "var(--main-color)",
      secondary: "var(--second-color)",
      desc: "var(--thrid-color)",
    },
  },
  rules: [
    [
      /^text-(.*)$/,
      ([, c], { theme }) => {
        if (theme.colors[c]) return { color: theme.colors[c] };
      },
    ],
    [
      /^bg-(.*)$/,
      ([, c], { theme }) => {
        if (theme.colors[c]) return { background: theme.colors[c] };
      },
    ],
    [
      /^border-(.*)$/,
      ([, c], { theme }) => {
        if (theme.colors[c]) return { "border-color": theme.colors[c] };
      },
    ],
  ],
});
