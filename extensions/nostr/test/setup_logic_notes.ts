/*
 * AUTO ANNOTATION
 * File: extensions/nostr/test/setup.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
// Test setup file for nostr extension
import { vi } from "vitest";

// Mock console.error to suppress noise in tests
vi.spyOn(console, "error").mockImplementation(() => {});
