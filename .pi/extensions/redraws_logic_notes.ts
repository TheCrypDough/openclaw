/*
 * AUTO ANNOTATION
 * File: .pi/extensions/redraws.ts
 * Purpose: File in .pi area for project orchestration/configuration/data.
 * Module area: Project-integrated prompt/tooling metadata for extensions
 * System effect: Change can influence project-integrated prompt/tooling metadata for extensions and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Redraws Extension
 *
 * Exposes /tui to show TUI redraw stats.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Text } from "@mariozechner/pi-tui";

export default function (pi: ExtensionAPI) {
  pi.registerCommand("tui", {
    description: "Show TUI stats",
    handler: async (_args, ctx) => {
      if (!ctx.hasUI) {
        return;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let redraws = 0;
      await ctx.ui.custom<void>((tui, _theme, _keybindings, done) => {
        redraws = tui.fullRedraws;
        done(undefined);
        return new Text("", 0, 0);
      });
      ctx.ui.notify(`TUI full redraws: ${redraws}`, "info");
    },
  });
}
