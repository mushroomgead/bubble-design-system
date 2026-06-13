import nextPlugin from "eslint-config-next";
import eslintConfigPrettier from "eslint-config-prettier";

const config = [{ ignores: ["dist/**"] }, ...nextPlugin, eslintConfigPrettier];

export default config;
