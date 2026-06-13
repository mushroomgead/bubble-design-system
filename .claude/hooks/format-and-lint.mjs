#!/usr/bin/env node
// PostToolUse hook: after Edit/MultiEdit/Write, runs Prettier (--write) on
// any file Prettier supports, then ESLint (--fix) on JS/TS files inside
// packages/ui or apps/docs. ESLint runs with cwd set to that workspace so
// it picks up the right flat config (eslint.config.mjs resolution is
// cwd-based, not file-based). Remaining ESLint errors after --fix are
// reported back to Claude via exit code 2.

import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const bin = (name) => path.join(repoRoot, "node_modules", ".bin", name);

let input;
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const filePath = input.tool_input?.file_path;
if (!filePath || !existsSync(filePath)) process.exit(0);

const ext = path.extname(filePath);
const rel = path.relative(repoRoot, filePath);

const PRETTIER_EXTS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".json",
  ".md",
  ".mdx",
  ".yml",
  ".yaml",
]);
const LINT_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

function run(command, args, cwd) {
  try {
    const output = execFileSync(command, args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { ok: true, output };
  } catch (err) {
    return { ok: false, output: (err.stdout ?? "") + (err.stderr ?? "") };
  }
}

const messages = [];

if (PRETTIER_EXTS.has(ext)) {
  const result = run(bin("prettier"), ["--write", filePath], repoRoot);
  if (!result.ok) messages.push(`prettier --write failed:\n${result.output}`);
}

let workspace = null;
if (rel.startsWith(`packages${path.sep}ui${path.sep}`)) {
  workspace = path.join(repoRoot, "packages/ui");
} else if (rel.startsWith(`apps${path.sep}docs${path.sep}`)) {
  workspace = path.join(repoRoot, "apps/docs");
}

if (workspace && LINT_EXTS.has(ext)) {
  run(bin("eslint"), ["--fix", filePath], workspace);
  const check = run(bin("eslint"), [filePath], workspace);
  if (!check.ok) messages.push(`eslint:\n${check.output}`);
}

if (messages.length > 0) {
  process.stderr.write(messages.join("\n\n"));
  process.exit(2);
}
