/*
 * AUTO ANNOTATION
 * File: src/browser/pw-session.browserless.live.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { isTruthyEnvValue } from "../infra/env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LIVE = isTruthyEnvValue(process.env.LIVE) || isTruthyEnvValue(process.env.OPENCLAW_LIVE_TEST);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CDP_URL = process.env.OPENCLAW_LIVE_BROWSER_CDP_URL?.trim() || "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const describeLive = LIVE && CDP_URL ? describe : describe.skip;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function waitFor(
  fn: () => Promise<boolean>,
  opts: { timeoutMs: number; intervalMs: number },
): Promise<void> {
  await expect.poll(fn, { timeout: opts.timeoutMs, interval: opts.intervalMs }).toBe(true);
}

describeLive("browser (live): remote CDP tab persistence", () => {
  it("creates, lists, focuses, and closes tabs via Playwright", { timeout: 60_000 }, async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pw = await import("./pw-ai.js");
    await pw.closePlaywrightBrowserConnection().catch(() => {});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const created = await pw.createPageViaPlaywright({ cdpUrl: CDP_URL, url: "about:blank" });
    try {
      await waitFor(
        async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const pages = await pw.listPagesViaPlaywright({ cdpUrl: CDP_URL });
          return pages.some((p) => p.targetId === created.targetId);
        },
        { timeoutMs: 10_000, intervalMs: 250 },
      );

      await pw.focusPageByTargetIdViaPlaywright({ cdpUrl: CDP_URL, targetId: created.targetId });

      await pw.closePageByTargetIdViaPlaywright({ cdpUrl: CDP_URL, targetId: created.targetId });

      await waitFor(
        async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const pages = await pw.listPagesViaPlaywright({ cdpUrl: CDP_URL });
          return !pages.some((p) => p.targetId === created.targetId);
        },
        { timeoutMs: 10_000, intervalMs: 250 },
      );
    } finally {
      await pw.closePlaywrightBrowserConnection().catch(() => {});
    }
  });
});
