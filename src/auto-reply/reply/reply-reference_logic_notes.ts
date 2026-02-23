/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/reply-reference.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ReplyToMode } from "../../config/types.js";

export type ReplyReferencePlanner = {
  /** Returns the effective reply/thread id for the next send and updates state. */
  use(): string | undefined;
  /** Mark that a reply was sent (needed when no reference is used). */
  markSent(): void;
  /** Whether a reply has been sent in this flow. */
  hasReplied(): boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createReplyReferencePlanner(options: {
  replyToMode: ReplyToMode;
  /** Existing thread/reference id (preferred when allowed by replyToMode). */
  existingId?: string;
  /** Id to start a new thread/reference when allowed (e.g., parent message id). */
  startId?: string;
  /** Disable reply references entirely (e.g., when posting inside a new thread). */
  allowReference?: boolean;
  /** Seed the planner with prior reply state. */
  hasReplied?: boolean;
}): ReplyReferencePlanner {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let hasReplied = options.hasReplied ?? false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowReference = options.allowReference !== false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existingId = options.existingId?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const startId = options.startId?.trim();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const use = (): string | undefined => {
    if (!allowReference) {
      return undefined;
    }
    if (options.replyToMode === "off") {
      return undefined;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = existingId ?? startId;
    if (!id) {
      return undefined;
    }
    if (options.replyToMode === "all") {
      hasReplied = true;
      return id;
    }
    // "first": only the first reply gets a reference.
    if (!hasReplied) {
      hasReplied = true;
      return id;
    }
    return undefined;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const markSent = () => {
    hasReplied = true;
  };

  return {
    use,
    markSent,
    hasReplied: () => hasReplied,
  };
}
