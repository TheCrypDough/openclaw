/*
 * AUTO ANNOTATION
 * File: src/cli/program.test-mocks.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Mock, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const messageCommand: Mock<(...args: unknown[]) => unknown> = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const statusCommand: Mock<(...args: unknown[]) => unknown> = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const configureCommand: Mock<(...args: unknown[]) => unknown> = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const configureCommandWithSections: Mock<(...args: unknown[]) => unknown> = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const setupCommand: Mock<(...args: unknown[]) => unknown> = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const onboardCommand: Mock<(...args: unknown[]) => unknown> = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const callGateway: Mock<(...args: unknown[]) => unknown> = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const runChannelLogin: Mock<(...args: unknown[]) => unknown> = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const runChannelLogout: Mock<(...args: unknown[]) => unknown> = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const runTui: Mock<(...args: unknown[]) => unknown> = vi.fn();

export const loadAndMaybeMigrateDoctorConfig: Mock<(...args: unknown[]) => unknown> = vi.fn();
export const ensureConfigReady: Mock<(...args: unknown[]) => unknown> = vi.fn();
export const ensurePluginRegistryLoaded: Mock<(...args: unknown[]) => unknown> = vi.fn();

export const runtime: {
  log: Mock<(...args: unknown[]) => void>;
  error: Mock<(...args: unknown[]) => void>;
  exit: Mock<(...args: unknown[]) => never>;
} = {
  log: vi.fn(),
  error: vi.fn(),
  exit: vi.fn(() => {
    throw new Error("exit");
  }),
};

export function installBaseProgramMocks() {
  vi.mock("../commands/message.js", () => ({ messageCommand }));
  vi.mock("../commands/status.js", () => ({ statusCommand }));
  vi.mock("../commands/configure.js", () => ({
    CONFIGURE_WIZARD_SECTIONS: [
      "workspace",
      "model",
      "web",
      "gateway",
      "daemon",
      "channels",
      "skills",
      "health",
    ],
    configureCommand,
    configureCommandWithSections,
    configureCommandFromSectionsArg: (sections: unknown, runtime: unknown) => {
      const resolved = Array.isArray(sections) ? sections : [];
      if (resolved.length > 0) {
        return configureCommandWithSections(resolved, runtime);
      }
      return configureCommand({}, runtime);
    },
  }));
  vi.mock("../commands/setup.js", () => ({ setupCommand }));
  vi.mock("../commands/onboard.js", () => ({ onboardCommand }));
  vi.mock("../runtime.js", () => ({ defaultRuntime: runtime }));
  vi.mock("./channel-auth.js", () => ({ runChannelLogin, runChannelLogout }));
  vi.mock("../tui/tui.js", () => ({ runTui }));
  vi.mock("../gateway/call.js", () => ({
    callGateway,
    randomIdempotencyKey: () => "idem-test",
    buildGatewayConnectionDetails: () => ({
      url: "ws://127.0.0.1:1234",
      urlSource: "test",
      message: "Gateway target: ws://127.0.0.1:1234",
    }),
  }));
  vi.mock("./deps.js", () => ({ createDefaultDeps: () => ({}) }));
}

export function installSmokeProgramMocks() {
  vi.mock("./plugin-registry.js", () => ({ ensurePluginRegistryLoaded }));
  vi.mock("../commands/doctor-config-flow.js", () => ({
    loadAndMaybeMigrateDoctorConfig,
  }));
  vi.mock("./program/config-guard.js", () => ({ ensureConfigReady }));
  vi.mock("./preaction.js", () => ({ registerPreActionHooks: () => {} }));
}
