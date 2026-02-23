/*
 * AUTO ANNOTATION
 * File: src/infra/net/ssrf.pinning.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import {
  createPinnedLookup,
  type LookupFn,
  resolvePinnedHostname,
  resolvePinnedHostnameWithPolicy,
  SsrFBlockedError,
} from "./ssrf.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createPublicLookupMock(): LookupFn {
  return vi.fn(async () => [{ address: "93.184.216.34", family: 4 }]) as unknown as LookupFn;
}

describe("ssrf pinning", () => {
  it("pins resolved addresses for the target hostname", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lookup = vi.fn(async () => [
      { address: "93.184.216.34", family: 4 },
      { address: "93.184.216.35", family: 4 },
    ]) as unknown as LookupFn;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pinned = await resolvePinnedHostname("Example.com.", lookup);
    expect(pinned.hostname).toBe("example.com");
    expect(pinned.addresses).toEqual(["93.184.216.34", "93.184.216.35"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = await new Promise<{ address: string; family?: number }>((resolve, reject) => {
      pinned.lookup("example.com", (err, address, family) => {
        if (err) {
          reject(err);
        } else {
          resolve({ address: address, family });
        }
      });
    });
    expect(first.address).toBe("93.184.216.34");
    expect(first.family).toBe(4);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const all = await new Promise<unknown>((resolve, reject) => {
      pinned.lookup("example.com", { all: true }, (err, addresses) => {
        if (err) {
          reject(err);
        } else {
          resolve(addresses);
        }
      });
    });
    expect(Array.isArray(all)).toBe(true);
    expect((all as Array<{ address: string }>).map((entry) => entry.address)).toEqual(
      pinned.addresses,
    );
  });

  it("rejects private DNS results", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lookup = vi.fn(async () => [{ address: "10.0.0.8", family: 4 }]) as unknown as LookupFn;
    await expect(resolvePinnedHostname("example.com", lookup)).rejects.toThrow(/private|internal/i);
  });

  it("falls back for non-matching hostnames", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fallback = vi.fn((host: string, options?: unknown, callback?: unknown) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cb = typeof options === "function" ? options : (callback as () => void);
      (cb as (err: null, address: string, family: number) => void)(null, "1.2.3.4", 4);
    }) as unknown as Parameters<typeof createPinnedLookup>[0]["fallback"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lookup = createPinnedLookup({
      hostname: "example.com",
      addresses: ["93.184.216.34"],
      fallback,
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await new Promise<{ address: string }>((resolve, reject) => {
      lookup("other.test", (err, address) => {
        if (err) {
          reject(err);
        } else {
          resolve({ address: address });
        }
      });
    });

    expect(fallback).toHaveBeenCalledTimes(1);
    expect(result.address).toBe("1.2.3.4");
  });

  it("enforces hostname allowlist when configured", async () => {
    const lookup = vi.fn(async () => [
      { address: "93.184.216.34", family: 4 },
    ]) as unknown as LookupFn;

    await expect(
      resolvePinnedHostnameWithPolicy("api.example.com", {
        lookupFn: lookup,
        policy: { hostnameAllowlist: ["cdn.example.com", "*.trusted.example"] },
      }),
    ).rejects.toThrow(/allowlist/i);
    expect(lookup).not.toHaveBeenCalled();
  });

  it("supports wildcard hostname allowlist patterns", async () => {
    const lookup = vi.fn(async () => [
      { address: "93.184.216.34", family: 4 },
    ]) as unknown as LookupFn;

    await expect(
      resolvePinnedHostnameWithPolicy("assets.example.com", {
        lookupFn: lookup,
        policy: { hostnameAllowlist: ["*.example.com"] },
      }),
    ).resolves.toMatchObject({ hostname: "assets.example.com" });

    await expect(
      resolvePinnedHostnameWithPolicy("example.com", {
        lookupFn: lookup,
        policy: { hostnameAllowlist: ["*.example.com"] },
      }),
    ).rejects.toThrow(/allowlist/i);
  });

  it.each([
    {
      name: "ISATAP embedded private IPv4",
      hostname: "2001:db8:1234::5efe:127.0.0.1",
    },
    {
      name: "legacy loopback IPv4 literal",
      hostname: "0177.0.0.1",
    },
    {
      name: "unsupported short-form IPv4 literal",
      hostname: "8.8.2056",
    },
  ])("blocks $name before DNS lookup", async ({ hostname }) => {
    const lookup = createPublicLookupMock();

    await expect(resolvePinnedHostnameWithPolicy(hostname, { lookupFn: lookup })).rejects.toThrow(
      SsrFBlockedError,
    );
    expect(lookup).not.toHaveBeenCalled();
  });

  it("allows ISATAP embedded private IPv4 when private network is explicitly enabled", async () => {
    const lookup = vi.fn(async () => [
      { address: "2001:db8:1234::5efe:127.0.0.1", family: 6 },
    ]) as unknown as LookupFn;

    await expect(
      resolvePinnedHostnameWithPolicy("2001:db8:1234::5efe:127.0.0.1", {
        lookupFn: lookup,
        policy: { allowPrivateNetwork: true },
      }),
    ).resolves.toMatchObject({
      hostname: "2001:db8:1234::5efe:127.0.0.1",
      addresses: ["2001:db8:1234::5efe:127.0.0.1"],
    });
    expect(lookup).toHaveBeenCalledTimes(1);
  });
});
