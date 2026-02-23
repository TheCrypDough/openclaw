/*
 * AUTO ANNOTATION
 * File: src/gateway/server-discovery.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const getTailnetHostname = vi.hoisted(() => vi.fn());

vi.mock("../infra/tailscale.js", () => ({ getTailnetHostname }));

import { resolveTailnetDnsHint } from "./server-discovery.js";

describe("resolveTailnetDnsHint", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prevTailnetDns = { value: undefined as string | undefined };

  beforeEach(() => {
    prevTailnetDns.value = process.env.OPENCLAW_TAILNET_DNS;
    delete process.env.OPENCLAW_TAILNET_DNS;
    getTailnetHostname.mockReset();
  });

  afterEach(() => {
    if (prevTailnetDns.value === undefined) {
      delete process.env.OPENCLAW_TAILNET_DNS;
    } else {
      process.env.OPENCLAW_TAILNET_DNS = prevTailnetDns.value;
    }
  });

  test("returns env hint when disabled", async () => {
    process.env.OPENCLAW_TAILNET_DNS = "studio.tailnet.ts.net.";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = await resolveTailnetDnsHint({ enabled: false });
    expect(value).toBe("studio.tailnet.ts.net");
    expect(getTailnetHostname).not.toHaveBeenCalled();
  });

  test("skips tailscale lookup when disabled", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = await resolveTailnetDnsHint({ enabled: false });
    expect(value).toBeUndefined();
    expect(getTailnetHostname).not.toHaveBeenCalled();
  });

  test("uses tailscale lookup when enabled", async () => {
    getTailnetHostname.mockResolvedValue("host.tailnet.ts.net");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = await resolveTailnetDnsHint({ enabled: true });
    expect(value).toBe("host.tailnet.ts.net");
    expect(getTailnetHostname).toHaveBeenCalledTimes(1);
  });
});
