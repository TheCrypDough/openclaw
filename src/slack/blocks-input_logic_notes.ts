/*
 * AUTO ANNOTATION
 * File: src/slack/blocks-input.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Block, KnownBlock } from "@slack/web-api";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SLACK_MAX_BLOCKS = 50;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseBlocksJson(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("blocks must be valid JSON");
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function assertBlocksArray(raw: unknown) {
  if (!Array.isArray(raw)) {
    throw new Error("blocks must be an array");
  }
  if (raw.length === 0) {
    throw new Error("blocks must contain at least one block");
  }
  if (raw.length > SLACK_MAX_BLOCKS) {
    throw new Error(`blocks cannot exceed ${SLACK_MAX_BLOCKS} items`);
  }
  for (const block of raw) {
    if (!block || typeof block !== "object" || Array.isArray(block)) {
      throw new Error("each block must be an object");
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const type = (block as { type?: unknown }).type;
    if (typeof type !== "string" || type.trim().length === 0) {
      throw new Error("each block must include a non-empty string type");
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateSlackBlocksArray(raw: unknown): (Block | KnownBlock)[] {
  assertBlocksArray(raw);
  return raw as (Block | KnownBlock)[];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSlackBlocksInput(raw: unknown): (Block | KnownBlock)[] | undefined {
  if (raw == null) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = typeof raw === "string" ? parseBlocksJson(raw) : raw;
  return validateSlackBlocksArray(parsed);
}
