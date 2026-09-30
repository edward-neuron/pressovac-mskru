// scripts/prerender.mjs
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");

// --- 1. Pull slugs via regex — avoids tsx importing binary assets ---
const dataSource = readFileSync(
  resolve(ROOT, "src/data/articlesData.ts"),
  "utf8"
);
const slugMatches = [...dataSource.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
const articleSlugs = slugMatches.map((m) => m[1]);

console.log(`Found ${articleSlugs.length} article slugs:`, articleSlugs);

// --- 2. Static routes ---
const STATIC_ROUTES = [
  "/",
  "/about",
  "/catalog",
  "/contacts",
  "/store",
  "/technology",
  "/training",
  "/delivery",
  "/privacy",
];

const ARTICLE_ROUTES = articleSlugs.map((s) => `/articles/${s}`);
const ALL_ROUTES = [...STATIC_ROUTES, ...ARTICLE_ROUTES];

console.log(`Prerendering ${ALL_ROUTES.length} routes...`);

// --- 3. Base HTML shell from Vite output ---
const baseHtml = readFileSync(resolve(DIST, "index.html"), "utf8");

// --- 4. Render each route via tsx + ReactDOMServer ---
for (const route of ALL_ROUTES) {
  const headHtml = execSync(
    `npx tsx --eval "
      import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import { HelmetProvider } from 'react-helmet-async';
      import { StaticRouter } from 'react-router-dom/server';
      import App from './src/App.tsx';

      const helmetContext = {};
      renderToStaticMarkup(
        React.createElement(HelmetProvider, { context: helmetContext },
          React.createElement(StaticRouter, { location: '${route}' },
            React.createElement(App)
          )
        )
      );
      const { helmet } = helmetContext;
      const head = [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ].filter(Boolean).join('\\n    ');
      process.stdout.write(head);
    "`,
    { cwd: ROOT, encoding: "utf8" }
  ).trim();

  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/, "")
    .replace("<head>", `<head>\n    ${headHtml}`);

  const outDir =
    route === "/"
      ? DIST
      : resolve(DIST, ...route.replace(/^\//, "").split("/"));

  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html, "utf8");
  console.log(`✓ ${route}`);
}

console.log(`\n✓ Done — ${ALL_ROUTES.length} routes prerendered.`);
