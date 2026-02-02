import nextEslintPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/", ".next/"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@next/next": nextEslintPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      ...nextEslintPlugin.configs.recommended.rules,
      ...nextEslintPlugin.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "warn",
    },
  },
];
