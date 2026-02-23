/*
 * AUTO ANNOTATION
 * File: src/commands/status-all/channels.mattermost-token-summary.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { listChannelPlugins } from "../../channels/plugins/index.js";
import type { ChannelPlugin } from "../../channels/plugins/types.js";
import { buildChannelsTable } from "./channels.js";

vi.mock("../../channels/plugins/index.js", () => ({
  listChannelPlugins: vi.fn(),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeMattermostPlugin(): ChannelPlugin {
  return {
    id: "mattermost",
    meta: {
      id: "mattermost",
      label: "Mattermost",
      selectionLabel: "Mattermost",
      docsPath: "/channels/mattermost",
      blurb: "test",
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
      listAccountIds: () => ["echo"],
      defaultAccountId: () => "echo",
      resolveAccount: () => ({
        name: "Echo",
        enabled: true,
        botToken: "bot-token-value",
        baseUrl: "https://mm.example.com",
      }),
      isConfigured: () => true,
      isEnabled: () => true,
    },
    actions: {
      listActions: () => ["send"],
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeSlackPlugin(params?: { botToken?: string; appToken?: string }): ChannelPlugin {
  return {
    id: "slack",
    meta: {
      id: "slack",
      label: "Slack",
      selectionLabel: "Slack",
      docsPath: "/channels/slack",
      blurb: "test",
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
      listAccountIds: () => ["primary"],
      defaultAccountId: () => "primary",
      resolveAccount: () => ({
        name: "Primary",
        enabled: true,
        botToken: params?.botToken ?? "bot-token",
        appToken: params?.appToken ?? "app-token",
      }),
      isConfigured: () => true,
      isEnabled: () => true,
    },
    actions: {
      listActions: () => ["send"],
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeTokenPlugin(): ChannelPlugin {
  return {
    id: "token-only",
    meta: {
      id: "token-only",
      label: "TokenOnly",
      selectionLabel: "TokenOnly",
      docsPath: "/channels/token-only",
      blurb: "test",
    },
    capabilities: { chatTypes: ["direct"] },
    config: {
      listAccountIds: () => ["primary"],
      defaultAccountId: () => "primary",
      resolveAccount: () => ({
        name: "Primary",
        enabled: true,
        token: "token-value",
      }),
      isConfigured: () => true,
      isEnabled: () => true,
    },
    actions: {
      listActions: () => ["send"],
    },
  };
}

describe("buildChannelsTable - mattermost token summary", () => {
  it("does not require appToken for mattermost accounts", async () => {
    vi.mocked(listChannelPlugins).mockReturnValue([makeMattermostPlugin()]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const table = await buildChannelsTable({ channels: {} } as never, {
      showSecrets: false,
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mattermostRow = table.rows.find((row) => row.id === "mattermost");
    expect(mattermostRow).toBeDefined();
    expect(mattermostRow?.state).toBe("ok");
    expect(mattermostRow?.detail).not.toContain("need bot+app");
  });

  it("keeps bot+app requirement when both fields exist", async () => {
    vi.mocked(listChannelPlugins).mockReturnValue([
      makeSlackPlugin({ botToken: "bot-token", appToken: "" }),
    ]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const table = await buildChannelsTable({ channels: {} } as never, {
      showSecrets: false,
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const slackRow = table.rows.find((row) => row.id === "slack");
    expect(slackRow).toBeDefined();
    expect(slackRow?.state).toBe("warn");
    expect(slackRow?.detail).toContain("need bot+app");
  });

  it("still reports single-token channels as ok", async () => {
    vi.mocked(listChannelPlugins).mockReturnValue([makeTokenPlugin()]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const table = await buildChannelsTable({ channels: {} } as never, {
      showSecrets: false,
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tokenRow = table.rows.find((row) => row.id === "token-only");
    expect(tokenRow).toBeDefined();
    expect(tokenRow?.state).toBe("ok");
    expect(tokenRow?.detail).toContain("token");
  });
});
