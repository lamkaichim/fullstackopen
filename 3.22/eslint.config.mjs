import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 忽略的文件和文件夹
  {
    ignores: ["node_modules/*", "dist/*", "eslint.config.mjs*"],
  },
  // 针对所有 JavaScript 文件的规则
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // 设置为 CommonJS 模块
      globals: {
        ...globals.node, // 启用 Node.js 全局变量
        process: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // 忽略以下划线开头的参数
      eqeqeq: "error", // 强制使用全等 ===
      "no-trailing-spaces": "error", // 禁止行尾空格
      "object-curly-spacing": ["error", "always"], // 强制对象大括号中有空格
      "arrow-spacing": ["error", { before: true, after: true }], // 强制箭头函数的箭头前后有空格
      "no-console": 0, // 允许使用 console
    },
  },
  // 插件推荐的规则
  pluginJs.configs.recommended, // JavaScript 推荐规则
  pluginReact.configs.flat.recommended, // React 推荐规则
];
