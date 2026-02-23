/*
 * AUTO ANNOTATION
 * File: scripts/write-plugin-sdk-entry-dts.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (write-plugin-sdk-entry-dts.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";

// `tsc` emits declarations under `dist/plugin-sdk/plugin-sdk/*` because the source lives
// at `src/plugin-sdk/*` and `rootDir` is `src/`.
//
// Our package export map points subpath `types` at `dist/plugin-sdk/<entry>.d.ts`, so we
// generate stable entry d.ts files that re-export the real declarations.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const entrypoints = ["index", "account-id"] as const;
for (const entry of entrypoints) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out = path.join(process.cwd(), `dist/plugin-sdk/${entry}.d.ts`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  // NodeNext: reference the runtime specifier with `.js`, TS will map it to `.d.ts`.
  fs.writeFileSync(out, `export * from "./plugin-sdk/${entry}.js";\n`, "utf8");
}
