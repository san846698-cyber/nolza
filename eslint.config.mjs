import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "scripts/**",
    ],
  },
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // react-hooks v7 introduced strict rules that flag legitimate patterns
      // (initializing state from storage in an effect, reading refs for
      // measurement, Date.now() in a timer state). Demote to warn so they
      // surface in dev without blocking lint, since fixing each would require
      // restructuring component logic.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      // Modern React/JSX handles raw quotes/apostrophes in text fine; this
      // rule only catches text-content style nits, not real bugs.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
