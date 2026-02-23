/*
 * AUTO ANNOTATION
 * File: src/macos/relay.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#!/usr/bin/env node
import process from "node:process";

declare const __OPENCLAW_VERSION__: string | undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const BUNDLED_VERSION =
  (typeof __OPENCLAW_VERSION__ === "string" && __OPENCLAW_VERSION__) ||
  process.env.OPENCLAW_BUNDLED_VERSION ||
  "0.0.0";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function patchBunLongForProtobuf(): Promise<void> {
  // Bun ships a global `Long` that protobufjs detects, but it is not long.js and
  // misses critical APIs (fromBits, ...). Baileys WAProto expects long.js.
  if (typeof process.versions.bun !== "string") {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mod = await import("long");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const Long = (mod as unknown as { default?: unknown }).default ?? mod;
  (globalThis as unknown as { Long?: unknown }).Long = Long;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function main() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const args = process.argv.slice(2);

  // Swift side expects `--version` to return a plain semver string.
  if (hasFlag(args, "--version") || hasFlag(args, "-V") || hasFlag(args, "-v")) {
    console.log(BUNDLED_VERSION);
    process.exit(0);
  }

  const { parseRelaySmokeTest, runRelaySmokeTest } = await import("./relay-smoke.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const smokeTest = parseRelaySmokeTest(args, process.env);
  if (smokeTest) {
    try {
      await runRelaySmokeTest(smokeTest);
      process.exit(0);
    } catch (err) {
      console.error(`Relay smoke test failed (${smokeTest}):`, err);
      process.exit(1);
    }
  }

  await patchBunLongForProtobuf();

  const { loadDotEnv } = await import("../infra/dotenv.js");
  loadDotEnv({ quiet: true });

  const { ensureOpenClawCliOnPath } = await import("../infra/path-env.js");
  ensureOpenClawCliOnPath();

  const { enableConsoleCapture } = await import("../logging.js");
  enableConsoleCapture();

  const { assertSupportedRuntime } = await import("../infra/runtime-guard.js");
  assertSupportedRuntime();
  const { formatUncaughtError } = await import("../infra/errors.js");
  const { installUnhandledRejectionHandler } = await import("../infra/unhandled-rejections.js");

  const { buildProgram } = await import("../cli/program.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const program = buildProgram();

  installUnhandledRejectionHandler();

  process.on("uncaughtException", (error) => {
    console.error("[openclaw] Uncaught exception:", formatUncaughtError(error));
    process.exit(1);
  });

  await program.parseAsync(process.argv);
}

void main().catch((err) => {
  console.error(
    "[openclaw] Relay failed:",
    err instanceof Error ? (err.stack ?? err.message) : err,
  );
  process.exit(1);
});
