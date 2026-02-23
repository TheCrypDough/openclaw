/*
 * AUTO ANNOTATION
 * File: src/cli/pairing-cli.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const listChannelPairingRequests = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const approveChannelPairingCode = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const notifyPairingApproved = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const pairingIdLabels: Record<string, string> = {
  telegram: "telegramUserId",
  discord: "discordUserId",
};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const normalizeChannelId = vi.fn((raw: string) => {
  if (!raw) {
    return null;
  }
  if (raw === "imsg") {
    return "imessage";
  }
  if (["telegram", "discord", "imessage"].includes(raw)) {
    return raw;
  }
  return null;
});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const getPairingAdapter = vi.fn((channel: string) => ({
  idLabel: pairingIdLabels[channel] ?? "userId",
}));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const listPairingChannels = vi.fn(() => ["telegram", "discord", "imessage"]);

vi.mock("../pairing/pairing-store.js", () => ({
  listChannelPairingRequests,
  approveChannelPairingCode,
}));

vi.mock("../channels/plugins/pairing.js", () => ({
  listPairingChannels,
  notifyPairingApproved,
  getPairingAdapter,
}));

vi.mock("../channels/plugins/index.js", () => ({
  normalizeChannelId,
}));

vi.mock("../config/config.js", () => ({
  loadConfig: vi.fn().mockReturnValue({}),
}));

describe("pairing cli", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let registerPairingCli: typeof import("./pairing-cli.js").registerPairingCli;

  beforeAll(async () => {
    ({ registerPairingCli } = await import("./pairing-cli.js"));
  });

  beforeEach(() => {
    listChannelPairingRequests.mockReset();
    approveChannelPairingCode.mockReset();
    notifyPairingApproved.mockReset();
    normalizeChannelId.mockClear();
    getPairingAdapter.mockClear();
    listPairingChannels.mockClear();
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function createProgram() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command();
    program.name("test");
    registerPairingCli(program);
    return program;
  }

  async function runPairing(args: string[]) {
    const program = createProgram();
    await program.parseAsync(args, { from: "user" });
  }

  function mockApprovedPairing() {
    approveChannelPairingCode.mockResolvedValueOnce({
      id: "123",
      entry: {
        id: "123",
        code: "ABCDEFGH",
        createdAt: "2026-01-08T00:00:00Z",
        lastSeenAt: "2026-01-08T00:00:00Z",
      },
    });
  }

  it("evaluates pairing channels when registering the CLI (not at import)", async () => {
    expect(listPairingChannels).not.toHaveBeenCalled();

    createProgram();

    expect(listPairingChannels).toHaveBeenCalledTimes(1);
  });

  it.each([
    {
      name: "telegram ids",
      channel: "telegram",
      id: "123",
      label: "telegramUserId",
      meta: { username: "peter" },
    },
    {
      name: "discord ids",
      channel: "discord",
      id: "999",
      label: "discordUserId",
      meta: { tag: "Ada#0001" },
    },
  ])("labels $name correctly", async ({ channel, id, label, meta }) => {
    listChannelPairingRequests.mockResolvedValueOnce([
      {
        id,
        code: "ABC123",
        createdAt: "2026-01-08T00:00:00Z",
        lastSeenAt: "2026-01-08T00:00:00Z",
        meta,
      },
    ]);

    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      await runPairing(["pairing", "list", "--channel", channel]);
      const output = log.mock.calls.map((call) => call.join(" ")).join("\n");
      expect(output).toContain(label);
      expect(output).toContain(id);
    } finally {
      log.mockRestore();
    }
  });

  it("accepts channel as positional for list", async () => {
    listChannelPairingRequests.mockResolvedValueOnce([]);

    await runPairing(["pairing", "list", "telegram"]);

    expect(listChannelPairingRequests).toHaveBeenCalledWith("telegram");
  });

  it("forwards --account for list", async () => {
    listChannelPairingRequests.mockResolvedValueOnce([]);

    await runPairing(["pairing", "list", "--channel", "telegram", "--account", "yy"]);

    expect(listChannelPairingRequests).toHaveBeenCalledWith("telegram", process.env, "yy");
  });

  it("normalizes channel aliases", async () => {
    listChannelPairingRequests.mockResolvedValueOnce([]);

    await runPairing(["pairing", "list", "imsg"]);

    expect(normalizeChannelId).toHaveBeenCalledWith("imsg");
    expect(listChannelPairingRequests).toHaveBeenCalledWith("imessage");
  });

  it("accepts extension channels outside the registry", async () => {
    listChannelPairingRequests.mockResolvedValueOnce([]);

    await runPairing(["pairing", "list", "zalo"]);

    expect(normalizeChannelId).toHaveBeenCalledWith("zalo");
    expect(listChannelPairingRequests).toHaveBeenCalledWith("zalo");
  });

  it("defaults list to the sole available channel", async () => {
    listPairingChannels.mockReturnValueOnce(["slack"]);
    listChannelPairingRequests.mockResolvedValueOnce([]);

    await runPairing(["pairing", "list"]);

    expect(listChannelPairingRequests).toHaveBeenCalledWith("slack");
  });

  it("accepts channel as positional for approve (npm-run compatible)", async () => {
    mockApprovedPairing();

    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      await runPairing(["pairing", "approve", "telegram", "ABCDEFGH"]);

      expect(approveChannelPairingCode).toHaveBeenCalledWith({
        channel: "telegram",
        code: "ABCDEFGH",
      });
      expect(log).toHaveBeenCalledWith(expect.stringContaining("Approved"));
    } finally {
      log.mockRestore();
    }
  });

  it("forwards --account for approve", async () => {
    mockApprovedPairing();

    await runPairing([
      "pairing",
      "approve",
      "--channel",
      "telegram",
      "--account",
      "yy",
      "ABCDEFGH",
    ]);

    expect(approveChannelPairingCode).toHaveBeenCalledWith({
      channel: "telegram",
      code: "ABCDEFGH",
      accountId: "yy",
    });
  });

  it("defaults approve to the sole available channel when only code is provided", async () => {
    listPairingChannels.mockReturnValueOnce(["slack"]);
    mockApprovedPairing();

    await runPairing(["pairing", "approve", "ABCDEFGH"]);

    expect(approveChannelPairingCode).toHaveBeenCalledWith({
      channel: "slack",
      code: "ABCDEFGH",
    });
  });

  it("keeps approve usage error when multiple channels exist and channel is omitted", async () => {
    await expect(runPairing(["pairing", "approve", "ABCDEFGH"])).rejects.toThrow("Usage:");
  });
});
