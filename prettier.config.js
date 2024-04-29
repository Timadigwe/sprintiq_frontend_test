/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  bracketSpacing: true,
  singleQuote: false,
  arrowParens: "avoid",
  printWidth: 80,
  semi: true,
};

export default config;
