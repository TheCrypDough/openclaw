/*
 * AUTO ANNOTATION
 * File: extensions/nextcloud-talk/src/policy.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { resolveNextcloudTalkAllowlistMatch } from "./policy.js";

describe("nextcloud-talk policy", () => {
  describe("resolveNextcloudTalkAllowlistMatch", () => {
    it("allows wildcard", () => {
      expect(
        resolveNextcloudTalkAllowlistMatch({
          allowFrom: ["*"],
          senderId: "user-id",
        }).allowed,
      ).toBe(true);
    });

    it("allows sender id match with normalization", () => {
      expect(
        resolveNextcloudTalkAllowlistMatch({
          allowFrom: ["nc:User-Id"],
          senderId: "user-id",
        }),
      ).toEqual({ allowed: true, matchKey: "user-id", matchSource: "id" });
    });

    it("blocks when sender id does not match", () => {
      expect(
        resolveNextcloudTalkAllowlistMatch({
          allowFrom: ["allowed"],
          senderId: "other",
        }).allowed,
      ).toBe(false);
    });
  });
});
