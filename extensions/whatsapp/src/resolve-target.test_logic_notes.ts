/*
 * AUTO ANNOTATION
 * File: extensions/whatsapp/src/resolve-target.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { installCommonResolveTargetErrorCases } from "../../shared/resolve-target-test-helpers.js";

vi.mock("openclaw/plugin-sdk", () => ({
  getChatChannelMeta: () => ({ id: "whatsapp", label: "WhatsApp" }),
  normalizeWhatsAppTarget: (value: string) => {
    if (value === "invalid-target") return null;
    // Simulate E.164 normalization: strip leading + and whatsapp: prefix
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stripped = value.replace(/^whatsapp:/i, "").replace(/^\+/, "");
    return stripped.includes("@g.us") ? stripped : `${stripped}@s.whatsapp.net`;
  },
  isWhatsAppGroupJid: (value: string) => value.endsWith("@g.us"),
  resolveWhatsAppOutboundTarget: ({
    to,
    allowFrom,
    mode,
  }: {
    to?: string;
    allowFrom: string[];
    mode: "explicit" | "implicit";
  }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = typeof to === "string" ? to.trim() : "";
    if (!raw) {
      return { ok: false, error: new Error("missing target") };
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalizeWhatsAppTarget = (value: string) => {
      if (value === "invalid-target") return null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const stripped = value.replace(/^whatsapp:/i, "").replace(/^\+/, "");
      return stripped.includes("@g.us") ? stripped : `${stripped}@s.whatsapp.net`;
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeWhatsAppTarget(raw);
    if (!normalized) {
      return { ok: false, error: new Error("invalid target") };
    }

    if (mode === "implicit" && !normalized.endsWith("@g.us")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const allowAll = allowFrom.includes("*");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const allowExact = allowFrom.some((entry) => {
        if (!entry) {
          return false;
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const normalizedEntry = normalizeWhatsAppTarget(entry.trim());
        return normalizedEntry?.toLowerCase() === normalized.toLowerCase();
      });
      if (!allowAll && !allowExact) {
        return { ok: false, error: new Error("target not allowlisted") };
      }
    }

    return { ok: true, to: normalized };
  },
  missingTargetError: (provider: string, hint: string) =>
    new Error(`Delivering to ${provider} requires target ${hint}`),
  WhatsAppConfigSchema: {},
  whatsappOnboardingAdapter: {},
  resolveWhatsAppHeartbeatRecipients: vi.fn(),
  buildChannelConfigSchema: vi.fn(),
  collectWhatsAppStatusIssues: vi.fn(),
  createActionGate: vi.fn(),
  DEFAULT_ACCOUNT_ID: "default",
  escapeRegExp: vi.fn(),
  formatPairingApproveHint: vi.fn(),
  listWhatsAppAccountIds: vi.fn(),
  listWhatsAppDirectoryGroupsFromConfig: vi.fn(),
  listWhatsAppDirectoryPeersFromConfig: vi.fn(),
  looksLikeWhatsAppTargetId: vi.fn(),
  migrateBaseNameToDefaultAccount: vi.fn(),
  normalizeAccountId: vi.fn(),
  normalizeE164: vi.fn(),
  normalizeWhatsAppMessagingTarget: vi.fn(),
  readStringParam: vi.fn(),
  resolveDefaultWhatsAppAccountId: vi.fn(),
  resolveWhatsAppAccount: vi.fn(),
  resolveWhatsAppGroupRequireMention: vi.fn(),
  resolveWhatsAppGroupToolPolicy: vi.fn(),
  applyAccountNameToChannelSection: vi.fn(),
}));

vi.mock("./runtime.js", () => ({
  getWhatsAppRuntime: vi.fn(() => ({
    channel: {
      text: { chunkText: vi.fn() },
      whatsapp: {
        sendMessageWhatsApp: vi.fn(),
        createLoginTool: vi.fn(),
      },
    },
  })),
}));

import { whatsappPlugin } from "./channel.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const resolveTarget = whatsappPlugin.outbound!.resolveTarget!;

describe("whatsapp resolveTarget", () => {
  it("should resolve valid target in explicit mode", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTarget({
      to: "5511999999999",
      mode: "explicit",
      allowFrom: [],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw result.error;
    }
    expect(result.to).toBe("5511999999999@s.whatsapp.net");
  });

  it("should resolve target in implicit mode with wildcard", () => {
    const result = resolveTarget({
      to: "5511999999999",
      mode: "implicit",
      allowFrom: ["*"],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw result.error;
    }
    expect(result.to).toBe("5511999999999@s.whatsapp.net");
  });

  it("should resolve target in implicit mode when in allowlist", () => {
    const result = resolveTarget({
      to: "5511999999999",
      mode: "implicit",
      allowFrom: ["5511999999999"],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw result.error;
    }
    expect(result.to).toBe("5511999999999@s.whatsapp.net");
  });

  it("should allow group JID regardless of allowlist", () => {
    const result = resolveTarget({
      to: "120363123456789@g.us",
      mode: "implicit",
      allowFrom: ["5511999999999"],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw result.error;
    }
    expect(result.to).toBe("120363123456789@g.us");
  });

  it("should error when target not in allowlist (implicit mode)", () => {
    const result = resolveTarget({
      to: "5511888888888",
      mode: "implicit",
      allowFrom: ["5511999999999", "5511777777777"],
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("expected resolution to fail");
    }
    expect(result.error).toBeDefined();
  });

  installCommonResolveTargetErrorCases({
    resolveTarget,
    implicitAllowFrom: ["5511999999999"],
  });
});
