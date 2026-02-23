/*
 * AUTO ANNOTATION
 * File: src/agents/openclaw-tools.subagents.sessions-spawn.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SessionsSpawnTestConfig = ReturnType<(typeof import("../config/config.js"))["loadConfig"]>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type CreateOpenClawTools = (typeof import("./openclaw-tools.js"))["createOpenClawTools"];
export type CreateOpenClawToolsOpts = Parameters<CreateOpenClawTools>[0];

// Avoid exporting vitest mock types (TS2742 under pnpm + d.ts emit).
// oxlint-disable-next-line typescript/no-explicit-any
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AnyMock = any;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const hoisted = vi.hoisted(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const callGatewayMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const defaultConfigOverride = {
    session: {
      mainKey: "main",
      scope: "per-sender",
    },
  } as SessionsSpawnTestConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const state = { configOverride: defaultConfigOverride };
  return { callGatewayMock, defaultConfigOverride, state };
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getCallGatewayMock(): AnyMock {
  return hoisted.callGatewayMock;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resetSessionsSpawnConfigOverride(): void {
  hoisted.state.configOverride = hoisted.defaultConfigOverride;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setSessionsSpawnConfigOverride(next: SessionsSpawnTestConfig): void {
  hoisted.state.configOverride = next;
}

export async function getSessionsSpawnTool(opts: CreateOpenClawToolsOpts) {
  // Dynamic import: ensure harness mocks are installed before tool modules load.
  const { createOpenClawTools } = await import("./openclaw-tools.js");
  const tool = createOpenClawTools(opts).find((candidate) => candidate.name === "sessions_spawn");
  if (!tool) {
    throw new Error("missing sessions_spawn tool");
  }
  return tool;
}

vi.mock("../gateway/call.js", () => ({
  callGateway: (opts: unknown) => hoisted.callGatewayMock(opts),
}));
// Some tools import callGateway via "../../gateway/call.js" (from nested folders). Mock that too.
vi.mock("../../gateway/call.js", () => ({
  callGateway: (opts: unknown) => hoisted.callGatewayMock(opts),
}));

vi.mock("../config/config.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../config/config.js")>();
  return {
    ...actual,
    loadConfig: () => hoisted.state.configOverride,
    resolveGatewayPort: () => 18789,
  };
});

// Same module, different specifier (used by tools under src/agents/tools/*).
vi.mock("../../config/config.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../config/config.js")>();
  return {
    ...actual,
    loadConfig: () => hoisted.state.configOverride,
    resolveGatewayPort: () => 18789,
  };
});
