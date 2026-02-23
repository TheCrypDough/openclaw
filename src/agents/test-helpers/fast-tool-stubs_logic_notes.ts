/*
 * AUTO ANNOTATION
 * File: src/agents/test-helpers/fast-tool-stubs.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";

export type StubTool = {
  name: string;
  description: string;
  parameters: { type: "object"; properties: Record<string, unknown> };
  // Keep the exported type portable: don't leak Vitest's mock types into .d.ts.
  execute: (...args: unknown[]) => unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const stubTool = (name: string): StubTool => ({
  name,
  description: `${name} stub`,
  parameters: { type: "object", properties: {} },
  execute: vi.fn() as unknown as (...args: unknown[]) => unknown,
});

vi.mock("../tools/image-tool.js", () => ({
  createImageTool: () => stubTool("image"),
}));

vi.mock("../tools/web-tools.js", () => ({
  createWebSearchTool: () => null,
  createWebFetchTool: () => null,
}));

vi.mock("../../plugins/tools.js", () => ({
  resolvePluginTools: () => [],
  getPluginToolMeta: () => undefined,
}));
