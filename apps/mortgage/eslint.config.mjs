/**
 * ESLint 9 config referenced from GitHub thread
 * @see https://github.com/vercel/next.js/issues/64409
 * And blog post
 * @see https://blog.linotte.dev/eslint-9-next-js-935c2b6d0371
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const patchedPluginNames = ["@next/next", "react-hooks"];

const patchedPlugins = [
    { ignores: [".next/*"] },
    ...compat.extends("next/core-web-vitals"),
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                },
            ],
        },
    },
].map((entry) => {
    for (const key in entry.plugins || {}) {
        if (patchedPluginNames.includes(key)) {
            entry.plugins[key] = fixupPluginRules(entry.plugins[key]);
        }
    }

    return entry;
});

export default tseslint.config(
    ...patchedPlugins,
    ...tseslint.configs.recommended
);
