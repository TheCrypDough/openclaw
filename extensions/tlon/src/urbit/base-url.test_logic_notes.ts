/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/urbit/base-url.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { validateUrbitBaseUrl } from "./base-url.js";

describe("validateUrbitBaseUrl", () => {
  it("adds https:// when scheme is missing and strips path/query fragments", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = validateUrbitBaseUrl("example.com/foo?bar=baz");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.baseUrl).toBe("https://example.com");
    expect(result.hostname).toBe("example.com");
  });

  it("rejects non-http schemes", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = validateUrbitBaseUrl("file:///etc/passwd");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("http:// or https://");
  });

  it("rejects embedded credentials", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = validateUrbitBaseUrl("https://user:pass@example.com");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("credentials");
  });

  it("normalizes a trailing dot in the hostname for origin construction", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = validateUrbitBaseUrl("https://example.com./foo");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.baseUrl).toBe("https://example.com");
    expect(result.hostname).toBe("example.com");
  });

  it("preserves port in the normalized origin", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = validateUrbitBaseUrl("http://example.com:8080/~/login");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.baseUrl).toBe("http://example.com:8080");
  });
});
