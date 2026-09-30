// scripts/prerender.mjs
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createServer } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");

// --- 1. Slug'и статей берём из исходника регуляркой (без импорта ассетов) ---
const dataSource = readFileSync(
  resolve(ROOT, "src/data/articlesData.ts"),
  "utf8"
);
const articleSlugs = [...dataSource.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(
  (m) => m[1]
);
console.log(`Found ${articleSlugs.length} article slugs`);

// --- 2. Маршруты ---
const STATIC_ROUTES = [
  "/",
  "/about",
  "/catalog",
  "/contacts",
  "/store",
  "/technology",
  "/training",
  "/articles",
  "/delivery",
  "/privacy",
];
const ARTICLE_ROUTES = articleSlugs.map((s) => `/articles/${s}`);
const ALL_ROUTES = [...STATIC_ROUTES, ...ARTICLE_ROUTES];

console.log(`Prerendering ${ALL_ROUTES.length} routes...`);

// --- 3. Базовый HTML от Vite ---
const baseHtml = readFileSync(resolve(DIST, "index.html"), "utf8");

// --- 4. Поднимаем Vite в SSR-режиме (умеет .webp, css, alias @) ---
const vite = await createServer({
  root: ROOT,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "warn",
});

try {
  const { renderHead } = await vite.ssrLoadModule("/scripts/render-head.tsx");

  for (const route of ALL_ROUTES) {
    let head = "";
    try {
      head = renderHead(route);
    } catch (e) {
      console.warn(`⚠ ${route} — head render failed: ${e.message}`);
    }

    let html = baseHtml.replace(/<title>[^<]*<\/title>/, "");
    html = html.replace("<head>", `<head>\n    ${head}`);

    const outDir =
      route === "/" ? DIST : resolve(DIST, ...route.slice(1).split("/"));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(resolve(outDir, "index.html"), html, "utf8");
    console.log(`✓ ${route}`);
  }
} finally {
  await vite.close();
}

console.log(`\n✓ Done — ${ALL_ROUTES.length} routes prerendered.`);
