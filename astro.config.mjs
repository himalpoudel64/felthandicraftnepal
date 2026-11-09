import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import { loadEnv } from "vite";

const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };

const font = (name, cssVariable, fallbacks, variants) => ({
  provider: fontProviders.local(),
  name,
  cssVariable,
  fallbacks,
  options: {
    variants: variants.map(([file, weight, style]) => ({
      src: [`./src/assets/fonts/${file}.woff2`],
      weight,
      style,
    })),
  },
});

export default defineConfig({
  site: env.SITE_URL || "https://felthandicraftnepal.com",
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  // The stylesheet is small. Inlining it removes the only render-blocking request.
  build: { format: "directory", inlineStylesheets: "always" },
  vite: { plugins: [tailwindcss()] },
  fonts: [
    font("Fraunces", "--font-fraunces", ["Georgia", "serif"], [
      ["fraunces-latin-400-normal", 400, "normal"],
      ["fraunces-latin-400-italic", 400, "italic"],
    ]),
    font("DM Sans", "--font-dm-sans", ["system-ui", "sans-serif"], [
      ["dm-sans-latin-400-normal", 400, "normal"],
      ["dm-sans-latin-500-normal", 500, "normal"],
    ]),
  ],
});
