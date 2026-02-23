/*
 * AUTO ANNOTATION
 * File: extensions/irc/src/normalize.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { hasIrcControlChars } from "./control-chars.js";
import type { IrcInboundMessage } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const IRC_TARGET_PATTERN = /^[^\s:]+$/u;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isChannelTarget(target: string): boolean {
  return target.startsWith("#") || target.startsWith("&");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeIrcMessagingTarget(raw: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let target = trimmed;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lowered = target.toLowerCase();
  if (lowered.startsWith("irc:")) {
    target = target.slice("irc:".length).trim();
  }
  if (target.toLowerCase().startsWith("channel:")) {
    target = target.slice("channel:".length).trim();
    if (!target.startsWith("#") && !target.startsWith("&")) {
      target = `#${target}`;
    }
  }
  if (target.toLowerCase().startsWith("user:")) {
    target = target.slice("user:".length).trim();
  }
  if (!target || !looksLikeIrcTargetId(target)) {
    return undefined;
  }
  return target;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function looksLikeIrcTargetId(raw: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }
  if (hasIrcControlChars(trimmed)) {
    return false;
  }
  return IRC_TARGET_PATTERN.test(trimmed);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeIrcAllowEntry(raw: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let value = raw.trim().toLowerCase();
  if (!value) {
    return "";
  }
  if (value.startsWith("irc:")) {
    value = value.slice("irc:".length);
  }
  if (value.startsWith("user:")) {
    value = value.slice("user:".length);
  }
  return value.trim();
}

export function normalizeIrcAllowlist(entries?: Array<string | number>): string[] {
  return (entries ?? []).map((entry) => normalizeIrcAllowEntry(String(entry))).filter(Boolean);
}

export function formatIrcSenderId(message: IrcInboundMessage): string {
  const base = message.senderNick.trim();
  const user = message.senderUser?.trim();
  const host = message.senderHost?.trim();
  if (user && host) {
    return `${base}!${user}@${host}`;
  }
  if (user) {
    return `${base}!${user}`;
  }
  if (host) {
    return `${base}@${host}`;
  }
  return base;
}

export function buildIrcAllowlistCandidates(message: IrcInboundMessage): string[] {
  const nick = message.senderNick.trim().toLowerCase();
  const user = message.senderUser?.trim().toLowerCase();
  const host = message.senderHost?.trim().toLowerCase();
  const candidates = new Set<string>();
  if (nick) {
    candidates.add(nick);
  }
  if (nick && user) {
    candidates.add(`${nick}!${user}`);
  }
  if (nick && host) {
    candidates.add(`${nick}@${host}`);
  }
  if (nick && user && host) {
    candidates.add(`${nick}!${user}@${host}`);
  }
  return [...candidates];
}

export function resolveIrcAllowlistMatch(params: {
  allowFrom: string[];
  message: IrcInboundMessage;
}): { allowed: boolean; source?: string } {
  const allowFrom = new Set(
    params.allowFrom.map((entry) => entry.trim().toLowerCase()).filter(Boolean),
  );
  if (allowFrom.has("*")) {
    return { allowed: true, source: "wildcard" };
  }
  const candidates = buildIrcAllowlistCandidates(params.message);
  for (const candidate of candidates) {
    if (allowFrom.has(candidate)) {
      return { allowed: true, source: candidate };
    }
  }
  return { allowed: false };
}
