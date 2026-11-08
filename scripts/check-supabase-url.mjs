import { loadEnv } from "vite";

const expectedOrigin = "https://api.pressovac-msk.ru";
const loadedEnv = loadEnv("production", process.cwd(), "VITE_");
const configuredUrl =
  process.env.VITE_SUPABASE_URL ?? loadedEnv.VITE_SUPABASE_URL ?? expectedOrigin;

let parsedUrl;

try {
  parsedUrl = new URL(configuredUrl);
} catch {
  console.error(
    `Build stopped: VITE_SUPABASE_URL must use ${new URL(expectedOrigin).host} over HTTPS.`,
  );
  process.exit(1);
}

const isExpectedApi =
  parsedUrl.origin === expectedOrigin &&
  parsedUrl.pathname === "/" &&
  parsedUrl.search === "" &&
  parsedUrl.hash === "" &&
  parsedUrl.username === "" &&
  parsedUrl.password === "";

if (!isExpectedApi) {
  console.error(
    `Build stopped: VITE_SUPABASE_URL must point to ${new URL(expectedOrigin).host} over HTTPS.`,
  );
  process.exit(1);
}

console.log(`VITE_SUPABASE_URL verified: ${new URL(expectedOrigin).host}`);
