/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/thread-bindings.shared-state.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createJiti } from "jiti";
import { beforeEach, describe, expect, it } from "vitest";
import {
  __testing as threadBindingsTesting,
  createThreadBindingManager,
  getThreadBindingManager,
} from "./thread-bindings.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ThreadBindingsModule = {
  getThreadBindingManager: typeof getThreadBindingManager;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function loadThreadBindingsViaAlternateLoader(): Promise<ThreadBindingsModule> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
  });
  try {
    return await jiti.import<ThreadBindingsModule>("./thread-bindings.ts");
  } catch (error) {
    // jiti@2 can fail under ESM test runners when mutating module.require.
    if (
      !(error instanceof TypeError) ||
      !String(error.message).includes("Cannot set property require")
    ) {
      throw error;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fallbackPath = "./thread-bindings.ts?vitest-loader-fallback";
    return (await import(/* @vite-ignore */ fallbackPath)) as ThreadBindingsModule;
  }
}

describe("thread binding manager state", () => {
  beforeEach(() => {
    threadBindingsTesting.resetThreadBindingsForTests();
  });

  it("shares managers between ESM and Jiti-loaded module instances", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const viaJiti = await loadThreadBindingsViaAlternateLoader();

    createThreadBindingManager({
      accountId: "work",
      persist: false,
      enableSweeper: false,
    });

    expect(getThreadBindingManager("work")).not.toBeNull();
    expect(viaJiti.getThreadBindingManager("work")).not.toBeNull();
  });
});
