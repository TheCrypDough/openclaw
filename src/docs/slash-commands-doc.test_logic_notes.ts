/*
 * AUTO ANNOTATION
 * File: src/docs/slash-commands-doc.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { listChatCommands } from "../auto-reply/commands-registry.js";
import { setActivePluginRegistry } from "../plugins/runtime.js";
import { createTestRegistry } from "../test-utils/channel-plugins.js";

beforeEach(() => {
  setActivePluginRegistry(createTestRegistry([]));
});

afterEach(() => {
  setActivePluginRegistry(createTestRegistry([]));
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function extractDocumentedSlashCommands(markdown: string): Set<string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const documented = new Set<string>();
  for (const match of markdown.matchAll(/`\/(?!<)([a-z0-9_-]+)/gi)) {
    documented.add(`/${match[1]}`);
  }
  return documented;
}

describe("slash commands docs", () => {
  it("documents all built-in chat command aliases", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const docPath = path.join(process.cwd(), "docs", "tools", "slash-commands.md");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const markdown = await fs.readFile(docPath, "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const documented = extractDocumentedSlashCommands(markdown);

    for (const command of listChatCommands()) {
      for (const alias of command.textAliases) {
        expect(documented.has(alias)).toBe(true);
      }
    }
  });
});
