// scripts/prerender.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { resolve, dirname, relative, isAbsolute, basename } from "path";
import { fileURLToPath } from "url";
import { createServer } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE_URL = "https://pressovac-msk.ru";
const SOURCE_ASSET_ROOT = resolve(ROOT, "src/assets");
const OUTPUT_ASSET_ROOT = resolve(DIST, "assets");

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
  "/reviews",
  "/delivery",
  "/privacy",
  "/inquiry",
];
const ARTICLE_ROUTES = articleSlugs.map((s) => `/articles/${s}`);
// Категории и товары магазина — отдельные индексируемые адреса
const storeData = JSON.parse(
  readFileSync(resolve(ROOT, "src/data/storeFallback.json"), "utf8")
);
const slugs = JSON.parse(readFileSync(resolve(ROOT, "src/data/storeSlugs.json"), "utf8"));
// Старые адреса по id тоже получают HTML (canonical указывает на ЧПУ)
const STORE_ROUTES = [
  ...storeData.categories.map((c) => `/store/category/${c.id}`),
  ...storeData.products.map((p) => `/store/product/${p.id}`),
];
const SLUG_ROUTES = [
  ...Object.values(slugs.categories).map((s) => `/store/${s}`),
  ...Object.values(slugs.products).map((s) => `/store/${s}`),
];
const ALL_ROUTES = [...SLUG_ROUTES, ...STATIC_ROUTES, ...ARTICLE_ROUTES, ...STORE_ROUTES];

console.log(`Prerendering ${ALL_ROUTES.length} routes...`);

// --- 3. Базовый HTML от Vite ---
const baseHtml = readFileSync(resolve(DIST, "index.html"), "utf8");

// Vite SSR оставляет исходные пути импортированных файлов. Для prerender
// заменяем их на имена файлов, реально опубликованных в dist/assets.
const emittedAssetsBySize = new Map();
for (const file of readdirSync(OUTPUT_ASSET_ROOT)) {
  const filePath = resolve(OUTPUT_ASSET_ROOT, file);
  const size = statSync(filePath).size;
  const sameSizeAssets = emittedAssetsBySize.get(size) ?? [];
  sameSizeAssets.push({ file, filePath });
  emittedAssetsBySize.set(size, sameSizeAssets);
}
const normalizedAssetUrls = new Map();

function resolveProductionAssetUrl(ssrUrl) {
  const cachedUrl = normalizedAssetUrls.get(ssrUrl);
  if (cachedUrl) return cachedUrl;

  const parsedUrl = new URL(ssrUrl);
  const sourceRelativePath = decodeURIComponent(
    parsedUrl.pathname.slice("/src/assets/".length)
  );
  const sourcePath = resolve(SOURCE_ASSET_ROOT, sourceRelativePath);
  const relativeSourcePath = relative(SOURCE_ASSET_ROOT, sourcePath);
  if (
    !relativeSourcePath ||
    relativeSourcePath.startsWith("..") ||
    isAbsolute(relativeSourcePath)
  ) {
    throw new Error(`Путь SSR-ассета выходит за src/assets: ${ssrUrl}`);
  }

  const sourceBytes = readFileSync(sourcePath);
  const candidates = emittedAssetsBySize.get(sourceBytes.length) ?? [];
  const emittedAsset = candidates.find(({ filePath }) =>
    readFileSync(filePath).equals(sourceBytes)
  );
  if (!emittedAsset) {
    throw new Error(
      `SSR-ассет не найден среди собранных файлов dist/assets: ${sourceRelativePath}`
    );
  }

  const productionUrl = new URL(
    `/assets/${basename(emittedAsset.file)}`,
    SITE_URL
  );
  productionUrl.search = parsedUrl.search;
  productionUrl.hash = parsedUrl.hash;
  const resolvedUrl = productionUrl.href;
  normalizedAssetUrls.set(ssrUrl, resolvedUrl);
  return resolvedUrl;
}

function normalizeSsrAssetUrls(head) {
  return head.replace(
    /https:\/\/pressovac-msk\.ru\/src\/assets\/[^"'\\s<>]+/g,
    resolveProductionAssetUrl
  );
}

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
    head = normalizeSsrAssetUrls(head);

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
