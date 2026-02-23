/*
 * AUTO ANNOTATION
 * File: src/line/actions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { messagingApi } from "@line/bot-sdk";

export type Action = messagingApi.Action;

/**
 * Create a message action (sends text when tapped)
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function messageAction(label: string, text?: string): Action {
  return {
    type: "message",
    label: label.slice(0, 20),
    text: text ?? label,
  };
}

/**
 * Create a URI action (opens a URL when tapped)
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function uriAction(label: string, uri: string): Action {
  return {
    type: "uri",
    label: label.slice(0, 20),
    uri,
  };
}

/**
 * Create a postback action (sends data to webhook when tapped)
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function postbackAction(label: string, data: string, displayText?: string): Action {
  return {
    type: "postback",
    label: label.slice(0, 20),
    data: data.slice(0, 300),
    displayText: displayText?.slice(0, 300),
  };
}

/**
 * Create a datetime picker action
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function datetimePickerAction(
  label: string,
  data: string,
  mode: "date" | "time" | "datetime",
  options?: {
    initial?: string;
    max?: string;
    min?: string;
  },
): Action {
  return {
    type: "datetimepicker",
    label: label.slice(0, 20),
    data: data.slice(0, 300),
    mode,
    initial: options?.initial,
    max: options?.max,
    min: options?.min,
  };
}
