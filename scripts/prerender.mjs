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
  const fileStats = statSync(filePath);
  if (!fileStats.isFile()) continue;
  const size = fileStats.size;
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

function normalizeSsrAssetUrls(markup) {
  return markup.replace(
    /(?:https:\/\/pressovac-msk\.ru)?\/src\/assets\/[^"'()\s<>]+/g,
    (ssrUrl) =>
      resolveProductionAssetUrl(new URL(ssrUrl, SITE_URL).href)
  );
}

function getMetaIdentity(tag) {
  const name = tag.match(/\sname\s*=\s*["']([^"']+)["']/i)?.[1];
  if (name) return `name:${name.toLowerCase()}`;

  const property = tag.match(/\sproperty\s*=\s*["']([^"']+)["']/i)?.[1];
  return property ? `property:${property.toLowerCase()}` : null;
}

function removeOverriddenBaseMetaTags(markup, renderedHead) {
  const renderedMetaIdentities = new Set(
    [...renderedHead.matchAll(/<meta\b[^>]*>/gi)]
      .map(([tag]) => getMetaIdentity(tag))
      .filter(Boolean)
  );

  return markup.replace(/<meta\b[^>]*>/gi, (tag) =>
    renderedMetaIdentities.has(getMetaIdentity(tag)) ? "" : tag
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
  const { renderPage } = await vite.ssrLoadModule("/scripts/render-head.tsx");

  for (const route of ALL_ROUTES) {
    let page = { head: "", body: "" };
    try {
      page = renderPage(route);
    } catch (e) {
      console.warn(`⚠ ${route} — SSR render failed: ${e.message}`);
    }
    const head = normalizeSsrAssetUrls(page.head);
    const body = normalizeSsrAssetUrls(page.body);

    let html = removeOverriddenBaseMetaTags(
      baseHtml.replace(/<title>[^<]*<\/title>/, ""),
      head
    );
    html = html.replace("<head>", `<head>\n    ${head}`);

    // Store content depends on the live Supabase response/local cache. Keep
    // those routes client-rendered until their data can be supplied reliably.
    const isStoreRoute = route === "/store" || route.startsWith("/store/");
    if (!isStoreRoute) {
      const rootPlaceholder = '<div id="root"></div>';
      if (!baseHtml.includes(rootPlaceholder)) {
        throw new Error("Не найден пустой #root для prerender-вставки");
      }
      if (!page.body.trim()) {
        throw new Error(`SSR не вернул содержимое для ${route}`);
      }
      html = html.replace(
        rootPlaceholder,
        `<div id="root" data-prerendered="true">${body}</div>`
      );
    }

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
