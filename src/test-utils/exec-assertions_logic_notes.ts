/*
 * AUTO ANNOTATION
 * File: src/test-utils/exec-assertions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { expect } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function expectSingleNpmInstallIgnoreScriptsCall(params: {
  calls: Array<[unknown, { cwd?: string } | undefined]>;
  expectedCwd: string;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const npmCalls = params.calls.filter((call) => Array.isArray(call[0]) && call[0][0] === "npm");
  expect(npmCalls.length).toBe(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const first = npmCalls[0];
  if (!first) {
    throw new Error("expected npm install call");
  }
  const [argv, opts] = first;
  expect(argv).toEqual(["npm", "install", "--omit=dev", "--silent", "--ignore-scripts"]);
  expect(opts?.cwd).toBe(params.expectedCwd);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function expectSingleNpmPackIgnoreScriptsCall(params: {
  calls: Array<[unknown, unknown]>;
  expectedSpec: string;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const packCalls = params.calls.filter(
    (call) => Array.isArray(call[0]) && call[0][0] === "npm" && call[0][1] === "pack",
  );
  expect(packCalls.length).toBe(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const packCall = packCalls[0];
  if (!packCall) {
    throw new Error("expected npm pack call");
  }
  const [argv, options] = packCall;
  expect(argv).toEqual(["npm", "pack", params.expectedSpec, "--ignore-scripts", "--json"]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const commandOptions = typeof options === "number" ? undefined : options;
  expect(commandOptions).toMatchObject({ env: { NPM_CONFIG_IGNORE_SCRIPTS: "true" } });
}
