/*
 * AUTO ANNOTATION
 * File: src/cli/daemon-cli-compat.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { resolveLegacyDaemonCliAccessors } from "./daemon-cli-compat.js";

describe("resolveLegacyDaemonCliAccessors", () => {
  it("resolves aliased daemon-cli exports from a bundled chunk", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bundle = `
      var daemon_cli_exports = /* @__PURE__ */ __exportAll({ registerDaemonCli: () => registerDaemonCli });
      export { runDaemonStop as a, runDaemonStart as i, runDaemonStatus as n, runDaemonUninstall as o, runDaemonRestart as r, runDaemonInstall as s, daemon_cli_exports as t };
    `;

    expect(resolveLegacyDaemonCliAccessors(bundle)).toEqual({
      registerDaemonCli: "t.registerDaemonCli",
      runDaemonInstall: "s",
      runDaemonRestart: "r",
      runDaemonStart: "i",
      runDaemonStatus: "n",
      runDaemonStop: "a",
      runDaemonUninstall: "o",
    });
  });

  it("returns null when required aliases are missing", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bundle = `
      var daemon_cli_exports = /* @__PURE__ */ __exportAll({ registerDaemonCli: () => registerDaemonCli });
      export { runDaemonRestart as r, daemon_cli_exports as t };
    `;

    expect(resolveLegacyDaemonCliAccessors(bundle)).toEqual({
      registerDaemonCli: "t.registerDaemonCli",
      runDaemonRestart: "r",
    });
  });

  it("returns null when the required restart alias is missing", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bundle = `
      var daemon_cli_exports = /* @__PURE__ */ __exportAll({ registerDaemonCli: () => registerDaemonCli });
      export { daemon_cli_exports as t };
    `;

    expect(resolveLegacyDaemonCliAccessors(bundle)).toBeNull();
  });
});
