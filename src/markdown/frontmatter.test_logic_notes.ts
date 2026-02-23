/*
 * AUTO ANNOTATION
 * File: src/markdown/frontmatter.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import JSON5 from "json5";
import { describe, expect, it } from "vitest";
import { parseFrontmatterBlock } from "./frontmatter.js";

describe("parseFrontmatterBlock", () => {
  it("parses YAML block scalars", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content = `---
name: yaml-hook
description: |
  line one
  line two
---
`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = parseFrontmatterBlock(content);
    expect(result.name).toBe("yaml-hook");
    expect(result.description).toBe("line one\nline two");
  });

  it("handles JSON5-style multi-line metadata", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content = `---
name: session-memory
metadata:
  {
    "openclaw":
      {
        "emoji": "disk",
        "events": ["command:new"],
      },
  }
---
`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = parseFrontmatterBlock(content);
    expect(result.metadata).toBeDefined();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON5.parse(result.metadata ?? "");
    expect(parsed.openclaw?.emoji).toBe("disk");
  });

  it("preserves inline JSON values", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content = `---
name: inline-json
metadata: {"openclaw": {"events": ["test"]}}
---
`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = parseFrontmatterBlock(content);
    expect(result.metadata).toBe('{"openclaw": {"events": ["test"]}}');
  });

  it("stringifies YAML objects and arrays", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content = `---
name: yaml-objects
enabled: true
retries: 3
tags:
  - alpha
  - beta
metadata:
  openclaw:
    events:
      - command:new
---
`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = parseFrontmatterBlock(content);
    expect(result.enabled).toBe("true");
    expect(result.retries).toBe("3");
    expect(JSON.parse(result.tags ?? "[]")).toEqual(["alpha", "beta"]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON5.parse(result.metadata ?? "");
    expect(parsed.openclaw?.events).toEqual(["command:new"]);
  });

  it("returns empty when frontmatter is missing", () => {
    const content = "# No frontmatter";
    expect(parseFrontmatterBlock(content)).toEqual({});
  });
});
