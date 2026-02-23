/*
 * AUTO ANNOTATION
 * File: src/line/flex-templates/message.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { messagingApi } from "@line/bot-sdk";
import type { FlexContainer } from "./types.js";

/**
 * Wrap a FlexContainer in a FlexMessage
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function toFlexMessage(altText: string, contents: FlexContainer): messagingApi.FlexMessage {
  return {
    type: "flex",
    altText,
    contents,
  };
}
