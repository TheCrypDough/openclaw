/*
 * AUTO ANNOTATION
 * File: src/commands/models.set.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const readConfigFileSnapshot = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const writeConfigFile = vi.fn().mockResolvedValue(undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const loadConfig = vi.fn().mockReturnValue({});

vi.mock("../config/config.js", () => ({
  CONFIG_PATH: "/tmp/openclaw.json",
  readConfigFileSnapshot,
  writeConfigFile,
  loadConfig,
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function mockConfigSnapshot(config: Record<string, unknown> = {}) {
  readConfigFileSnapshot.mockResolvedValue({
    path: "/tmp/openclaw.json",
    exists: true,
    raw: "{}",
    parsed: {},
    valid: true,
    config,
    issues: [],
    legacyIssues: [],
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeRuntime() {
  return { log: vi.fn(), error: vi.fn(), exit: vi.fn() };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getWrittenConfig() {
  return writeConfigFile.mock.calls[0]?.[0] as Record<string, unknown>;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function expectWrittenPrimaryModel(model: string) {
  expect(writeConfigFile).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const written = getWrittenConfig();
  expect(written.agents).toEqual({
    defaults: {
      model: { primary: model },
      models: { [model]: {} },
    },
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let modelsSetCommand: typeof import("./models/set.js").modelsSetCommand;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let modelsFallbacksAddCommand: typeof import("./models/fallbacks.js").modelsFallbacksAddCommand;

describe("models set + fallbacks", () => {
  beforeAll(async () => {
    ({ modelsSetCommand } = await import("./models/set.js"));
    ({ modelsFallbacksAddCommand } = await import("./models/fallbacks.js"));
  });

  beforeEach(() => {
    readConfigFileSnapshot.mockReset();
    writeConfigFile.mockClear();
  });

  it("normalizes z.ai provider in models set", async () => {
    mockConfigSnapshot({});
    const runtime = makeRuntime();

    await modelsSetCommand("z.ai/glm-4.7", runtime);

    expectWrittenPrimaryModel("zai/glm-4.7");
  });

  it("normalizes z-ai provider in models fallbacks add", async () => {
    mockConfigSnapshot({ agents: { defaults: { model: { fallbacks: [] } } } });
    const runtime = makeRuntime();

    await modelsFallbacksAddCommand("z-ai/glm-4.7", runtime);

    expect(writeConfigFile).toHaveBeenCalledTimes(1);
    const written = getWrittenConfig();
    expect(written.agents).toEqual({
      defaults: {
        model: { fallbacks: ["zai/glm-4.7"] },
        models: { "zai/glm-4.7": {} },
      },
    });
  });

  it("normalizes provider casing in models set", async () => {
    mockConfigSnapshot({});
    const runtime = makeRuntime();

    await modelsSetCommand("Z.AI/glm-4.7", runtime);

    expectWrittenPrimaryModel("zai/glm-4.7");
  });
});
