import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "src/generated/**",
    "src/sanity/extract.json",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  ...nextVitals,
  {
    rules: {
      "react/no-unescaped-entities": 0,
      // React Compiler-era rules (react-hooks v6, enabled by eslint-config-next 16)
      // flag pre-compiler idioms used across this codebase: hydration-mounted gates
      // (useEffect(() => setMounted(true), [])), client-only Math.random() generation
      // for framer-motion particle animations, and prop->state form sync. These are
      // established patterns that the compiler rules reject by design; full compliance
      // requires a dedicated React 19 migration pass. Kept as warnings so new violations
      // stay visible without breaking the build.
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
    },
  },
]);

export default eslintConfig;
