import js from "@eslint/js";
import reactRefresh from "eslint-plugin-react-refresh";
import reactHooks from "eslint-plugin-react-hooks";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";

const compat = new FlatCompat({
  baseDirectory: path.resolve(),
});

export default [
  js.configs.recommended,
  ...compat.extends("plugin:react/recommended", "plugin:@typescript-eslint/recommended"),
  {
    plugins: {
      "react-refresh": reactRefresh,
      "react-hooks": reactHooks,
    },
    rules: {
      "react-refresh/only-export-components": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

