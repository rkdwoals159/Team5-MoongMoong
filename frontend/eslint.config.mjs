// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next. (node_modules, 빌드 산출물 포함)
  globalIgnores([".next/**", "out/**", "build/**", "html/**", "next-env.d.ts"]),
  ...storybook.configs["flat/recommended"],
]);

export default eslintConfig;
