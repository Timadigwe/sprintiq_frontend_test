/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: [
    "@typescript-eslint",
    "simple-import-sort",
    "prettier",
  ],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:json/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "prettier/prettier": "warn",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "react/no-children-prop": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "jsx-a11y/accessible-emoji": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "react-hooks/exhaustive-deps": "off",
  },
  ignorePatterns: ["node_modules", ".next", "template"],
  settings: {
    tailwindcss: {
      config: "tailwind.config.cjs",
    },
  },
};
module.exports = config;
