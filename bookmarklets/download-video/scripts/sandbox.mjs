import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ctx = await esbuild.context({
  entryPoints: [path.join(root, "src/index.ts")],
  bundle: true,
  format: "iife",
  target: "es2022",
  sourcemap: "linked",
  outfile: path.join(root, "sandbox/index.js"),
});

const { port } = await ctx.serve({
  host: "localhost",
  servedir: path.join(root, "sandbox"),
});

console.log(`Sandbox running at http://localhost:${port}`);
