/*
 * AUTO ANNOTATION
 * File: extensions/nextcloud-talk/src/signature.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createHmac, randomBytes } from "node:crypto";
import type { NextcloudTalkWebhookHeaders } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SIGNATURE_HEADER = "x-nextcloud-talk-signature";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RANDOM_HEADER = "x-nextcloud-talk-random";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const BACKEND_HEADER = "x-nextcloud-talk-backend";

/**
 * Verify the HMAC-SHA256 signature of an incoming webhook request.
 * Signature is calculated as: HMAC-SHA256(random + body, secret)
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function verifyNextcloudTalkSignature(params: {
  signature: string;
  random: string;
  body: string;
  secret: string;
}): boolean {
  const { signature, random, body, secret } = params;
  if (!signature || !random || !secret) {
    return false;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const expected = createHmac("sha256", secret)
    .update(random + body)
    .digest("hex");

  if (signature.length !== expected.length) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Extract webhook headers from an incoming request.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractNextcloudTalkHeaders(
  headers: Record<string, string | string[] | undefined>,
): NextcloudTalkWebhookHeaders | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const getHeader = (name: string): string | undefined => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = headers[name] ?? headers[name.toLowerCase()];
    return Array.isArray(value) ? value[0] : value;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const signature = getHeader(SIGNATURE_HEADER);
  const random = getHeader(RANDOM_HEADER);
  const backend = getHeader(BACKEND_HEADER);

  if (!signature || !random || !backend) {
    return null;
  }

  return { signature, random, backend };
}

/**
 * Generate signature headers for an outbound request to Nextcloud Talk.
 */
export function generateNextcloudTalkSignature(params: { body: string; secret: string }): {
  random: string;
  signature: string;
} {
  const { body, secret } = params;
  const random = randomBytes(32).toString("hex");
  const signature = createHmac("sha256", secret)
    .update(random + body)
    .digest("hex");
  return { random, signature };
}
