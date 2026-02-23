/*
 * AUTO ANNOTATION
 * File: src/commands/channels/capabilities.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
process.env.NO_COLOR = "1";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { getChannelPlugin, listChannelPlugins } from "../../channels/plugins/index.js";
import type { ChannelPlugin } from "../../channels/plugins/types.js";
import { fetchSlackScopes } from "../../slack/scopes.js";
import { channelsCapabilitiesCommand } from "./capabilities.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const logs: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const errors: string[] = [];

vi.mock("./shared.js", () => ({
  requireValidConfig: vi.fn(async () => ({ channels: {} })),
  formatChannelAccountLabel: vi.fn(
    ({ channel, accountId }: { channel: string; accountId: string }) => `${channel}:${accountId}`,
  ),
}));

vi.mock("../../channels/plugins/index.js", () => ({
  listChannelPlugins: vi.fn(),
  getChannelPlugin: vi.fn(),
}));

vi.mock("../../slack/scopes.js", () => ({
  fetchSlackScopes: vi.fn(),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const runtime = {
  log: (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  },
  error: (...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  },
  exit: (code: number) => {
    throw new Error(`exit:${code}`);
  },
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resetOutput() {
  logs.length = 0;
  errors.length = 0;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildPlugin(params: {
  id: string;
  capabilities?: ChannelPlugin["capabilities"];
  account?: Record<string, unknown>;
  probe?: unknown;
}): ChannelPlugin {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const capabilities =
    params.capabilities ?? ({ chatTypes: ["direct"] } as ChannelPlugin["capabilities"]);
  return {
    id: params.id,
    meta: {
      id: params.id,
      label: params.id,
      selectionLabel: params.id,
      docsPath: "/channels/test",
      blurb: "test",
    },
    capabilities,
    config: {
      listAccountIds: () => ["default"],
      resolveAccount: () => params.account ?? { accountId: "default" },
      defaultAccountId: () => "default",
      isConfigured: () => true,
      isEnabled: () => true,
    },
    status: params.probe
      ? {
          probeAccount: async () => params.probe,
        }
      : undefined,
    actions: {
      listActions: () => ["poll"],
    },
  };
}

describe("channelsCapabilitiesCommand", () => {
  beforeEach(() => {
    resetOutput();
    vi.clearAllMocks();
  });

  it("prints Slack bot + user scopes when user token is configured", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const plugin = buildPlugin({
      id: "slack",
      account: {
        accountId: "default",
        botToken: "xoxb-bot",
        config: { userToken: "xoxp-user" },
      },
      probe: { ok: true, bot: { name: "openclaw" }, team: { name: "team" } },
    });
    vi.mocked(listChannelPlugins).mockReturnValue([plugin]);
    vi.mocked(getChannelPlugin).mockReturnValue(plugin);
    vi.mocked(fetchSlackScopes).mockImplementation(async (token: string) => {
      if (token === "xoxp-user") {
        return { ok: true, scopes: ["users:read"], source: "auth.scopes" };
      }
      return { ok: true, scopes: ["chat:write"], source: "auth.scopes" };
    });

    await channelsCapabilitiesCommand({ channel: "slack" }, runtime);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const output = logs.join("\n");
    expect(output).toContain("Bot scopes");
    expect(output).toContain("User scopes");
    expect(output).toContain("chat:write");
    expect(output).toContain("users:read");
    expect(fetchSlackScopes).toHaveBeenCalledWith("xoxb-bot", expect.any(Number));
    expect(fetchSlackScopes).toHaveBeenCalledWith("xoxp-user", expect.any(Number));
  });

  it("prints Teams Graph permission hints when present", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const plugin = buildPlugin({
      id: "msteams",
      probe: {
        ok: true,
        appId: "app-id",
        graph: {
          ok: true,
          roles: ["ChannelMessage.Read.All", "Files.Read.All"],
        },
      },
    });
    vi.mocked(listChannelPlugins).mockReturnValue([plugin]);
    vi.mocked(getChannelPlugin).mockReturnValue(plugin);

    await channelsCapabilitiesCommand({ channel: "msteams" }, runtime);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const output = logs.join("\n");
    expect(output).toContain("ChannelMessage.Read.All (channel history)");
    expect(output).toContain("Files.Read.All (files (OneDrive))");
  });
});
