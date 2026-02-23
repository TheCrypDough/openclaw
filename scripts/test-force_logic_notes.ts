/*
 * AUTO ANNOTATION
 * File: scripts/test-force.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (test-force.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#!/usr/bin/env -S node --import tsx
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { forceFreePort, type PortProcess } from "../src/cli/ports.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_PORT = 18789;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function killGatewayListeners(port: number): PortProcess[] {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const killed = forceFreePort(port);
    if (killed.length > 0) {
      console.log(
        `freed port ${port}; terminated: ${killed
          .map((p) => `${p.command} (pid ${p.pid})`)
          .join(", ")}`,
      );
    } else {
      console.log(`port ${port} already free`);
    }
    return killed;
  } catch (err) {
    console.error(`failed to free port ${port}: ${String(err)}`);
    return [];
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function runTests() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isolatedLock =
    process.env.OPENCLAW_GATEWAY_LOCK ??
    path.join(os.tmpdir(), `openclaw-gateway.lock.test.${Date.now()}`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = spawnSync("pnpm", ["vitest", "run"], {
    stdio: "inherit",
    env: {
      ...process.env,
      OPENCLAW_GATEWAY_LOCK: isolatedLock,
    },
  });
  if (result.error) {
    console.error(`pnpm test failed to start: ${String(result.error)}`);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function main() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const port = Number.parseInt(process.env.OPENCLAW_GATEWAY_PORT ?? `${DEFAULT_PORT}`, 10);

  console.log(`🧹 test:force - clearing gateway on port ${port}`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const killed = killGatewayListeners(port);
  if (killed.length === 0) {
    console.log("no listeners to kill");
  }

  console.log("running pnpm test…");
  runTests();
}

main();
