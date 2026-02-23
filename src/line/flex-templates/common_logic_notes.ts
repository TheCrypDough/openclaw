/*
 * AUTO ANNOTATION
 * File: src/line/flex-templates/common.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { FlexBox, FlexBubble, FlexText } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function attachFooterText(bubble: FlexBubble, footer: string) {
  bubble.footer = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: footer,
        size: "xs",
        color: "#AAAAAA",
        wrap: true,
        align: "center",
      } as FlexText,
    ],
    paddingAll: "lg",
    backgroundColor: "#FAFAFA",
  } as FlexBox;
}
