import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.resolve(ROOT, "src/lib/api/schema.d.ts");
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const OPENAPI_URL = `${API_URL}/api/openapi.json`;

const skipIfCached = process.argv.includes("--skip-if-cached");

if (skipIfCached && fs.existsSync(OUTPUT)) {
  const stat = fs.statSync(OUTPUT);
  const ageMs = Date.now() - stat.mtimeMs;
  const ONE_DAY = 24 * 60 * 60 * 1000;
  if (ageMs < ONE_DAY) {
    console.log(`[codegen] schema.d.ts is fresh (${Math.round(ageMs / 1000)}s old), skipping.`);
    process.exit(0);
  }
}

console.log(`[codegen] Fetching OpenAPI spec from ${OPENAPI_URL} …`);

let specJson: string;
try {
  const res = await fetch(OPENAPI_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  specJson = await res.text();
} catch (err) {
  console.error(`[codegen] ERROR: Could not reach the API at ${OPENAPI_URL}`);
  console.error(`         Make sure the backend is running: cd /var/projects/personal/backend/node/tte-ecommerce-api && pnpm dev`);
  console.error(err);
  if (skipIfCached && fs.existsSync(OUTPUT)) {
    console.warn("[codegen] WARNING: Using stale cached schema.d.ts (API unreachable).");
    process.exit(0);
  }
  process.exit(1);
}

const tmpSpec = path.resolve(ROOT, "node_modules/.cache/openapi-spec.json");
fs.mkdirSync(path.dirname(tmpSpec), { recursive: true });
fs.writeFileSync(tmpSpec, specJson);

console.log("[codegen] Running openapi-typescript …");

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

try {
  execSync(
    `pnpm exec openapi-typescript "${tmpSpec}" --output "${OUTPUT}" --root-types`,
    { cwd: ROOT, stdio: "inherit" },
  );
} catch {
  console.error("[codegen] openapi-typescript failed.");
  process.exit(1);
}

console.log(`[codegen] Done → ${path.relative(ROOT, OUTPUT)}`);
