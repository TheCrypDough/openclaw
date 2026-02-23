/*
 * AUTO ANNOTATION
 * File: src/config/zod-schema.sensitive.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { z } from "zod";

// Everything registered here will be redacted when the config is exposed,
// e.g. sent to the dashboard
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const sensitive = z.registry<undefined, z.ZodType>();
