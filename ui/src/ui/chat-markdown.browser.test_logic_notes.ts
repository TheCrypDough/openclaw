/*
 * AUTO ANNOTATION
 * File: ui/src/ui/chat-markdown.browser.test.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { mountApp, registerAppMountHooks } from "./test-helpers/app-mount.ts";

registerAppMountHooks();

describe("chat markdown rendering", () => {
  it("renders markdown inside tool output sidebar", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const app = mountApp("/chat");
    await app.updateComplete;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const timestamp = Date.now();
    app.chatMessages = [
      {
        role: "assistant",
        content: [
          { type: "toolcall", name: "noop", arguments: {} },
          { type: "toolresult", name: "noop", text: "Hello **world**" },
        ],
        timestamp,
      },
    ];

    await app.updateComplete;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolCards = Array.from(app.querySelectorAll<HTMLElement>(".chat-tool-card"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolCard = toolCards.find((card) =>
      card.querySelector(".chat-tool-card__preview, .chat-tool-card__inline"),
    );
    expect(toolCard).not.toBeUndefined();
    toolCard?.click();

    await app.updateComplete;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const strong = app.querySelector(".sidebar-markdown strong");
    expect(strong?.textContent).toBe("world");
  });
});
