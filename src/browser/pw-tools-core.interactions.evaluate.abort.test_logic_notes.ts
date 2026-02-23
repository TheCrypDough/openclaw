/*
 * AUTO ANNOTATION
 * File: src/browser/pw-tools-core.interactions.evaluate.abort.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let page: { evaluate: ReturnType<typeof vi.fn> } | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let locator: { evaluate: ReturnType<typeof vi.fn> } | null = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const forceDisconnectPlaywrightForTarget = vi.fn(async () => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const getPageForTargetId = vi.fn(async () => {
  if (!page) {
    throw new Error("test: page not set");
  }
  return page;
});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ensurePageState = vi.fn(() => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const restoreRoleRefsForTarget = vi.fn(() => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const refLocator = vi.fn(() => {
  if (!locator) {
    throw new Error("test: locator not set");
  }
  return locator;
});

vi.mock("./pw-session.js", () => {
  return {
    ensurePageState,
    forceDisconnectPlaywrightForTarget,
    getPageForTargetId,
    refLocator,
    restoreRoleRefsForTarget,
  };
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let evaluateViaPlaywright: typeof import("./pw-tools-core.interactions.js").evaluateViaPlaywright;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createPendingEval() {
  let evalCalled!: () => void;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const evalCalledPromise = new Promise<void>((resolve) => {
    evalCalled = resolve;
  });
  return {
    evalCalledPromise,
    resolveEvalCalled: evalCalled,
  };
}

describe("evaluateViaPlaywright (abort)", () => {
  beforeAll(async () => {
    ({ evaluateViaPlaywright } = await import("./pw-tools-core.interactions.js"));
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    { label: "page.evaluate", fn: "() => 1" },
    { label: "locator.evaluate", fn: "(el) => el.textContent", ref: "e1" },
  ])("rejects when aborted after $label starts", async ({ fn, ref }) => {
    const ctrl = new AbortController();
    const pending = createPendingEval();
    const pendingPromise = new Promise(() => {});

    page = {
      evaluate: vi.fn(() => {
        if (!ref) {
          pending.resolveEvalCalled();
        }
        return pendingPromise;
      }),
    };
    locator = {
      evaluate: vi.fn(() => {
        if (ref) {
          pending.resolveEvalCalled();
        }
        return pendingPromise;
      }),
    };

    const p = evaluateViaPlaywright({
      cdpUrl: "http://127.0.0.1:9222",
      fn,
      ref,
      signal: ctrl.signal,
    });

    await pending.evalCalledPromise;
    ctrl.abort(new Error("aborted by test"));

    await expect(p).rejects.toThrow("aborted by test");
    expect(forceDisconnectPlaywrightForTarget).toHaveBeenCalled();
  });
});
