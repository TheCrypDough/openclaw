/*
 * AUTO ANNOTATION
 * File: src/media-understanding/resolve.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { resolveEntriesWithActiveFallback, resolveModelEntries } from "./resolve.js";
import type { MediaUnderstandingCapability } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const providerRegistry = new Map<string, { capabilities: MediaUnderstandingCapability[] }>([
  ["openai", { capabilities: ["image"] }],
  ["groq", { capabilities: ["audio"] }],
]);

describe("resolveModelEntries", () => {
  it("uses provider capabilities for shared entries without explicit caps", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      tools: {
        media: {
          models: [{ provider: "openai", model: "gpt-5.2" }],
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const imageEntries = resolveModelEntries({
      cfg,
      capability: "image",
      providerRegistry,
    });
    expect(imageEntries).toHaveLength(1);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const audioEntries = resolveModelEntries({
      cfg,
      capability: "audio",
      providerRegistry,
    });
    expect(audioEntries).toHaveLength(0);
  });

  it("keeps per-capability entries even without explicit caps", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      tools: {
        media: {
          image: {
            models: [{ provider: "openai", model: "gpt-5.2" }],
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const imageEntries = resolveModelEntries({
      cfg,
      capability: "image",
      config: cfg.tools?.media?.image,
      providerRegistry,
    });
    expect(imageEntries).toHaveLength(1);
  });

  it("skips shared CLI entries without capabilities", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      tools: {
        media: {
          models: [{ type: "cli", command: "gemini", args: ["--file", "{{MediaPath}}"] }],
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entries = resolveModelEntries({
      cfg,
      capability: "image",
      providerRegistry,
    });
    expect(entries).toHaveLength(0);
  });
});

describe("resolveEntriesWithActiveFallback", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  type ResolveWithFallbackInput = Parameters<typeof resolveEntriesWithActiveFallback>[0];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const defaultActiveModel = { provider: "groq", model: "whisper-large-v3" } as const;

  function resolveWithActiveFallback(params: {
    cfg: ResolveWithFallbackInput["cfg"];
    capability: ResolveWithFallbackInput["capability"];
    config: ResolveWithFallbackInput["config"];
  }) {
    return resolveEntriesWithActiveFallback({
      cfg: params.cfg,
      capability: params.capability,
      config: params.config,
      providerRegistry,
      activeModel: defaultActiveModel,
    });
  }

  it("uses active model when enabled and no models are configured", () => {
    const cfg: OpenClawConfig = {
      tools: {
        media: {
          audio: { enabled: true },
        },
      },
    };

    const entries = resolveWithActiveFallback({
      cfg,
      capability: "audio",
      config: cfg.tools?.media?.audio,
    });
    expect(entries).toHaveLength(1);
    expect(entries[0]?.provider).toBe("groq");
  });

  it("ignores active model when configured entries exist", () => {
    const cfg: OpenClawConfig = {
      tools: {
        media: {
          audio: { enabled: true, models: [{ provider: "openai", model: "whisper-1" }] },
        },
      },
    };

    const entries = resolveWithActiveFallback({
      cfg,
      capability: "audio",
      config: cfg.tools?.media?.audio,
    });
    expect(entries).toHaveLength(1);
    expect(entries[0]?.provider).toBe("openai");
  });

  it("skips active model when provider lacks capability", () => {
    const cfg: OpenClawConfig = {
      tools: {
        media: {
          video: { enabled: true },
        },
      },
    };

    const entries = resolveWithActiveFallback({
      cfg,
      capability: "video",
      config: cfg.tools?.media?.video,
    });
    expect(entries).toHaveLength(0);
  });
});
