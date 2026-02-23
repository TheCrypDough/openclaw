# AUTOPLACEHOLDER_ANNOTATION: src/wizard/onboarding.gateway-config.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { describe, expect, it, vi } from "vitest";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter, WizardSelectParams } from "./prompts.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mocks = vi.hoisted(() => ({
  randomToken: vi.fn(),
}));

vi.mock("../commands/onboard-helpers.js", async (importActual) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importActual<typeof import("../commands/onboard-helpers.js")>();
  return {
    ...actual,
    randomToken: mocks.randomToken,
  };
});

vi.mock("../infra/tailscale.js", () => ({
  findTailscaleBinary: vi.fn(async () => undefined),
}));

import { configureGatewayForOnboarding } from "./onboarding.gateway-config.js";

describe("configureGatewayForOnboarding", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function createPrompter(params: { selectQueue: string[]; textQueue: Array<string | undefined> }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const selectQueue = [...params.selectQueue];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const textQueue = [...params.textQueue];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const select = vi.fn(
      async (_params: WizardSelectParams<unknown>) => selectQueue.shift() as unknown,
    ) as unknown as WizardPrompter["select"];

    return {
      intro: vi.fn(async () => {}),
      outro: vi.fn(async () => {}),
      note: vi.fn(async () => {}),
      select,
      multiselect: vi.fn(async () => []),
      text: vi.fn(async () => textQueue.shift() as string),
      confirm: vi.fn(async () => false),
      progress: vi.fn(() => ({ update: vi.fn(), stop: vi.fn() })),
    } satisfies WizardPrompter;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function createRuntime(): RuntimeEnv {
    return {
      log: vi.fn(),
      error: vi.fn(),
      exit: vi.fn(),
    };
  }

  it("generates a token when the prompt returns undefined", async () => {
    mocks.randomToken.mockReturnValue("generated-token");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prompter = createPrompter({
      selectQueue: ["loopback", "token", "off"],
      textQueue: ["18789", undefined],
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime = createRuntime();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await configureGatewayForOnboarding({
      flow: "advanced",
      baseConfig: {},
      nextConfig: {},
      localPort: 18789,
      quickstartGateway: {
        hasExisting: false,
        port: 18789,
        bind: "loopback",
        authMode: "token",
        tailscaleMode: "off",
        token: undefined,
        password: undefined,
        customBindHost: undefined,
        tailscaleResetOnExit: false,
      },
      prompter,
      runtime,
    });

    expect(result.settings.gatewayToken).toBe("generated-token");
    expect(result.nextConfig.gateway?.nodes?.denyCommands).toEqual([
      "camera.snap",
      "camera.clip",
      "screen.record",
      "calendar.add",
      "contacts.add",
      "reminders.add",
    ]);
  });
  it("does not set password to literal 'undefined' when prompt returns undefined", async () => {
    mocks.randomToken.mockReturnValue("unused");

    // Flow: loopback bind → password auth → tailscale off
    const prompter = createPrompter({
      selectQueue: ["loopback", "password", "off"],
      textQueue: ["18789", undefined],
    });
    const runtime = createRuntime();

    const result = await configureGatewayForOnboarding({
      flow: "advanced",
      baseConfig: {},
      nextConfig: {},
      localPort: 18789,
      quickstartGateway: {
        hasExisting: false,
        port: 18789,
        bind: "loopback",
        authMode: "password",
        tailscaleMode: "off",
        token: undefined,
        password: undefined,
        customBindHost: undefined,
        tailscaleResetOnExit: false,
      },
      prompter,
      runtime,
    });

    const authConfig = result.nextConfig.gateway?.auth as { mode?: string; password?: string };
    expect(authConfig?.mode).toBe("password");
    expect(authConfig?.password).toBe("");
    expect(authConfig?.password).not.toBe("undefined");
  });
});
