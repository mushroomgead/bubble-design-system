// Concatenates tokens.css + base.css + every component CSS file into a
// single dist/styles.css. Also copies tokens.css to dist/ for the
// "@bubble-design-system/ui/tokens.css" sub-path.
//
// We intentionally don't depend on postcss-import — this keeps the build
// pipeline dependency-free and easy to reason about. The source file
// src/styles.css uses @imports for IDE/dev clarity; the file consumers
// receive is a flat stylesheet.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");

const read = (rel) => fs.readFileSync(path.join(srcDir, rel), "utf8");

const tokens = read("tokens.css");
const base = read("base.css");

const componentsDir = path.join(srcDir, "components");
const componentFiles = fs
  .readdirSync(componentsDir)
  .filter((f) => f.endsWith(".css"))
  .sort();

const sections = [
  "/* === tokens.css === */",
  tokens,
  "",
  "/* === base.css === */",
  base,
  "",
];

for (const file of componentFiles) {
  sections.push(`/* === components/${file} === */`);
  sections.push(fs.readFileSync(path.join(componentsDir, file), "utf8"));
  sections.push("");
}

const stylesCss = sections.join("\n");

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "styles.css"), stylesCss);
fs.writeFileSync(path.join(distDir, "tokens.css"), tokens);

const kb = (stylesCss.length / 1024).toFixed(1);
console.log(
  `✓ dist/styles.css (${kb} KB, ${componentFiles.length} components + tokens + base)`,
);
console.log(`✓ dist/tokens.css (${(tokens.length / 1024).toFixed(1)} KB)`);
