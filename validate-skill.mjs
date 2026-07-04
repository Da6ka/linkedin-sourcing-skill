#!/usr/bin/env node
// Dependency-free structural validation for this skill repo.
// Catches the two failure modes that actually break a Claude skill:
//   1. SKILL.md missing its `name` / `description` frontmatter.
//   2. A relative Markdown link pointing at a file that doesn't exist.
// Run with: node validate-skill.mjs   (exits non-zero on any failure)
import {
  readFileSync,
  existsSync,
  readdirSync,
  statSync,
  lstatSync,
} from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const errors = [];

// 1. SKILL.md frontmatter -----------------------------------------------------
const skillPath = join(root, "SKILL.md");
if (!existsSync(skillPath)) {
  errors.push("SKILL.md is missing");
} else {
  // Strip a leading BOM and any leading blank lines — both are common from
  // Windows editors and would otherwise make a valid frontmatter block miss
  // the anchored regex below and report a false "no frontmatter" failure.
  const text = readFileSync(skillPath, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/^\s*\n/, "");
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!fm) {
    errors.push("SKILL.md has no YAML frontmatter block");
  } else {
    for (const key of ["name", "description"]) {
      if (!new RegExp(`^${key}:`, "m").test(fm[1])) {
        errors.push(`SKILL.md frontmatter is missing "${key}:"`);
      }
    }
  }
}

// 2. Relative Markdown links resolve ------------------------------------------
function mdFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === ".git" || entry === "node_modules") continue;
    const full = join(dir, entry);
    // Use lstat (doesn't follow symlinks) so a symlinked directory is treated
    // as a leaf, not traversed — a symlink loop would otherwise recurse
    // forever instead of failing cleanly.
    if (lstatSync(full).isSymbolicLink()) continue;
    if (statSync(full).isDirectory()) out.push(...mdFiles(full));
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

// GitHub's heading-to-anchor slug algorithm, best-effort: lowercase, strip
// anything that isn't a letter/number/space/hyphen, spaces become hyphens.
// Doesn't handle GitHub's duplicate-heading "-1"/"-2" suffixing.
function slugify(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

function headingSlugs(text) {
  const slugs = new Set();
  const headingRe = /^#{1,6}\s+(.+)$/gm;
  let h;
  while ((h = headingRe.exec(text))) slugs.add(slugify(h[1]));
  return slugs;
}

const linkRe = /\[[^\]]*\]\(([^)]+)\)/g;
const fencedCodeBlockRe = /```[\s\S]*?```/g;
for (const file of mdFiles(root)) {
  // Strip fenced code blocks first — format templates elsewhere in this repo
  // use literal placeholder text like `[link]` inside ``` fences, which would
  // otherwise match the link regex and fail on a file that doesn't exist.
  const text = readFileSync(file, "utf8").replace(fencedCodeBlockRe, "");
  let m;
  while ((m = linkRe.exec(text))) {
    let target = m[1].trim();
    // Skip external links, anchors, and mailto.
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const [pathPart, fragment] = target.split("#");
    target = pathPart;
    if (!target) continue;
    const resolvedPath = resolve(dirname(file), target);
    if (!existsSync(resolvedPath)) {
      errors.push(`${file.replace(root + "/", "")}: broken link -> ${m[1]}`);
      continue;
    }
    // Best-effort anchor check: only for links pointing at another .md file
    // with a #fragment, since that's the case a broken link actually breaks
    // navigation (external/HTML anchors aren't covered here).
    if (fragment && target.endsWith(".md")) {
      const targetText = readFileSync(resolvedPath, "utf8");
      if (!headingSlugs(targetText).has(fragment.toLowerCase())) {
        errors.push(
          `${file.replace(root + "/", "")}: broken anchor -> ${m[1]} (no heading slug "${fragment}" in ${target})`,
        );
      }
    }
  }
}

if (errors.length) {
  console.error("Skill validation FAILED:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("Skill validation passed.");
