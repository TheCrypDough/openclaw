/*
 * AUTO ANNOTATION
 * File: src/auto-reply/stage-sandbox-media.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { join } from "node:path";
import { withTempHome as withTempHomeBase } from "../../test/helpers/temp-home.js";
import type { OpenClawConfig } from "../config/config.js";
import type { MsgContext, TemplateContext } from "./templating.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withSandboxMediaTempHome<T>(
  prefix: string,
  fn: (home: string) => Promise<T>,
): Promise<T> {
  return withTempHomeBase(async (home) => await fn(home), { prefix });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSandboxMediaContexts(mediaPath: string): {
  ctx: MsgContext;
  sessionCtx: TemplateContext;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ctx: MsgContext = {
    Body: "hi",
    From: "whatsapp:group:demo",
    To: "+2000",
    ChatType: "group",
    Provider: "whatsapp",
    MediaPath: mediaPath,
    MediaType: "image/jpeg",
    MediaUrl: mediaPath,
  };
  return { ctx, sessionCtx: { ...ctx } };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSandboxMediaStageConfig(home: string): OpenClawConfig {
  return {
    agents: {
      defaults: {
        model: "anthropic/claude-opus-4-5",
        workspace: join(home, "openclaw"),
        sandbox: {
          mode: "non-main",
          workspaceRoot: join(home, "sandboxes"),
        },
      },
    },
    channels: { whatsapp: { allowFrom: ["*"] } },
    session: { store: join(home, "sessions.json") },
  } as OpenClawConfig;
}
