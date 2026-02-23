/*
 * AUTO ANNOTATION
 * File: src/node-host/invoke.sanitize-env.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { withEnv } from "../test-utils/env.js";
import { sanitizeEnv } from "./invoke.js";
import { buildNodeInvokeResultParams } from "./runner.js";

describe("node-host sanitizeEnv", () => {
  it("ignores PATH overrides", () => {
    withEnv({ PATH: "/usr/bin" }, () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const env = sanitizeEnv({ PATH: "/tmp/evil:/usr/bin" });
      expect(env.PATH).toBe("/usr/bin");
    });
  });

  it("blocks dangerous env keys/prefixes", () => {
    withEnv({ PYTHONPATH: undefined, LD_PRELOAD: undefined, BASH_ENV: undefined }, () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const env = sanitizeEnv({
        PYTHONPATH: "/tmp/pwn",
        LD_PRELOAD: "/tmp/pwn.so",
        BASH_ENV: "/tmp/pwn.sh",
        FOO: "bar",
      });
      expect(env.FOO).toBe("bar");
      expect(env.PYTHONPATH).toBeUndefined();
      expect(env.LD_PRELOAD).toBeUndefined();
      expect(env.BASH_ENV).toBeUndefined();
    });
  });

  it("drops dangerous inherited env keys even without overrides", () => {
    withEnv({ PATH: "/usr/bin:/bin", BASH_ENV: "/tmp/pwn.sh" }, () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const env = sanitizeEnv(undefined);
      expect(env.PATH).toBe("/usr/bin:/bin");
      expect(env.BASH_ENV).toBeUndefined();
    });
  });
});

describe("buildNodeInvokeResultParams", () => {
  it("omits optional fields when null/undefined", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = buildNodeInvokeResultParams(
      { id: "invoke-1", nodeId: "node-1", command: "system.run" },
      { ok: true, payloadJSON: null, error: null },
    );

    expect(params).toEqual({ id: "invoke-1", nodeId: "node-1", ok: true });
    expect("payloadJSON" in params).toBe(false);
    expect("error" in params).toBe(false);
  });

  it("includes payloadJSON when provided", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = buildNodeInvokeResultParams(
      { id: "invoke-2", nodeId: "node-2", command: "system.run" },
      { ok: true, payloadJSON: '{"ok":true}' },
    );

    expect(params.payloadJSON).toBe('{"ok":true}');
  });

  it("includes payload when provided", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = buildNodeInvokeResultParams(
      { id: "invoke-3", nodeId: "node-3", command: "system.run" },
      { ok: false, payload: { reason: "bad" } },
    );

    expect(params.payload).toEqual({ reason: "bad" });
  });
});
