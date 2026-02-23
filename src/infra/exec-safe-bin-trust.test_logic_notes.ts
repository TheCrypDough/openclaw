/*
 * AUTO ANNOTATION
 * File: src/infra/exec-safe-bin-trust.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { describe, expect, it } from "vitest";
import { withEnv } from "../test-utils/env.js";
import {
  buildTrustedSafeBinDirs,
  getTrustedSafeBinDirs,
  isTrustedSafeBinPath,
} from "./exec-safe-bin-trust.js";

describe("exec safe bin trust", () => {
  it("builds trusted dirs from defaults and injected PATH", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dirs = buildTrustedSafeBinDirs({
      pathEnv: "/custom/bin:/alt/bin:/custom/bin",
      delimiter: ":",
      baseDirs: ["/usr/bin"],
    });

    expect(dirs.has(path.resolve("/usr/bin"))).toBe(true);
    expect(dirs.has(path.resolve("/custom/bin"))).toBe(true);
    expect(dirs.has(path.resolve("/alt/bin"))).toBe(true);
    expect(dirs.size).toBe(3);
  });

  it("memoizes trusted dirs per PATH snapshot", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const a = getTrustedSafeBinDirs({
      pathEnv: "/first/bin",
      delimiter: ":",
      refresh: true,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const b = getTrustedSafeBinDirs({
      pathEnv: "/first/bin",
      delimiter: ":",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const c = getTrustedSafeBinDirs({
      pathEnv: "/second/bin",
      delimiter: ":",
    });

    expect(a).toBe(b);
    expect(c).not.toBe(b);
  });

  it("validates resolved paths using injected trusted dirs", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trusted = new Set([path.resolve("/usr/bin")]);
    expect(
      isTrustedSafeBinPath({
        resolvedPath: "/usr/bin/jq",
        trustedDirs: trusted,
      }),
    ).toBe(true);
    expect(
      isTrustedSafeBinPath({
        resolvedPath: "/tmp/evil/jq",
        trustedDirs: trusted,
      }),
    ).toBe(false);
  });

  it("uses startup PATH snapshot when pathEnv is omitted", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const injected = `/tmp/openclaw-path-injected-${Date.now()}`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const initial = getTrustedSafeBinDirs({ refresh: true });

    withEnv({ PATH: `${injected}${path.delimiter}${process.env.PATH ?? ""}` }, () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const refreshed = getTrustedSafeBinDirs({ refresh: true });
      expect(refreshed.has(path.resolve(injected))).toBe(false);
      expect([...refreshed].toSorted()).toEqual([...initial].toSorted());
    });
  });
});
