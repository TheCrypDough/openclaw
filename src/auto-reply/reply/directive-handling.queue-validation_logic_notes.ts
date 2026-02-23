/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/directive-handling.queue-validation.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../../config/config.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { ReplyPayload } from "../types.js";
import type { InlineDirectives } from "./directive-handling.parse.js";
import { withOptions } from "./directive-handling.shared.js";
import { resolveQueueSettings } from "./queue.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function maybeHandleQueueDirective(params: {
  directives: InlineDirectives;
  cfg: OpenClawConfig;
  channel: string;
  sessionEntry?: SessionEntry;
}): ReplyPayload | undefined {
  const { directives } = params;
  if (!directives.hasQueueDirective) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const wantsStatus =
    !directives.queueMode &&
    !directives.queueReset &&
    !directives.hasQueueOptions &&
    directives.rawQueueMode === undefined &&
    directives.rawDebounce === undefined &&
    directives.rawCap === undefined &&
    directives.rawDrop === undefined;
  if (wantsStatus) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const settings = resolveQueueSettings({
      cfg: params.cfg,
      channel: params.channel,
      sessionEntry: params.sessionEntry,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const debounceLabel =
      typeof settings.debounceMs === "number" ? `${settings.debounceMs}ms` : "default";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const capLabel = typeof settings.cap === "number" ? String(settings.cap) : "default";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dropLabel = settings.dropPolicy ?? "default";
    return {
      text: withOptions(
        `Current queue settings: mode=${settings.mode}, debounce=${debounceLabel}, cap=${capLabel}, drop=${dropLabel}.`,
        "modes steer, followup, collect, steer+backlog, interrupt; debounce:<ms|s|m>, cap:<n>, drop:old|new|summarize",
      ),
    };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const queueModeInvalid =
    !directives.queueMode && !directives.queueReset && Boolean(directives.rawQueueMode);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const queueDebounceInvalid =
    directives.rawDebounce !== undefined && typeof directives.debounceMs !== "number";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const queueCapInvalid = directives.rawCap !== undefined && typeof directives.cap !== "number";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const queueDropInvalid = directives.rawDrop !== undefined && !directives.dropPolicy;

  if (queueModeInvalid || queueDebounceInvalid || queueCapInvalid || queueDropInvalid) {
    const errors: string[] = [];
    if (queueModeInvalid) {
      errors.push(
        `Unrecognized queue mode "${directives.rawQueueMode ?? ""}". Valid modes: steer, followup, collect, steer+backlog, interrupt.`,
      );
    }
    if (queueDebounceInvalid) {
      errors.push(
        `Invalid debounce "${directives.rawDebounce ?? ""}". Use ms/s/m (e.g. debounce:1500ms, debounce:2s).`,
      );
    }
    if (queueCapInvalid) {
      errors.push(
        `Invalid cap "${directives.rawCap ?? ""}". Use a positive integer (e.g. cap:10).`,
      );
    }
    if (queueDropInvalid) {
      errors.push(
        `Invalid drop policy "${directives.rawDrop ?? ""}". Use drop:old, drop:new, or drop:summarize.`,
      );
    }
    return { text: errors.join(" ") };
  }

  return undefined;
}
