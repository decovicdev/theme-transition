import { defineConfig } from "tsup"

export default defineConfig(options => ({
  entry: ["src/index.tsx"],
  minify: !options.watch,
  dts: true,
  clean: true,
  external: ["react", "react-dom", "next-themes"],
  sourcemap: false,
  format: ["esm", "cjs"],
  splitting: true,
  bundle: true
}))
