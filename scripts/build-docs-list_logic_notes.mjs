/*
 * AUTO ANNOTATION
 * File: scripts/build-docs-list.mjs
 * Purpose: Operational script for maintenance/build/release/test workflows (build-docs-list.mjs).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const binDir = path.join(root, "bin");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const binPath = path.join(binDir, "docs-list");

fs.mkdirSync(binDir, { recursive: true });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const wrapper = `#!/usr/bin/env node\nimport { spawnSync } from "node:child_process";\nimport path from "node:path";\nimport { fileURLToPath } from "node:url";\n\nconst here = path.dirname(fileURLToPath(import.meta.url));\nconst script = path.join(here, "..", "scripts", "docs-list.js");\n\nconst result = spawnSync(process.execPath, [script], { stdio: "inherit" });\nprocess.exit(result.status ?? 1);\n`;

fs.writeFileSync(binPath, wrapper, { mode: 0o755 });
