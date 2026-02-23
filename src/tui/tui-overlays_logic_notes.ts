/*
 * AUTO ANNOTATION
 * File: src/tui/tui-overlays.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Component, TUI } from "@mariozechner/pi-tui";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type OverlayHost = Pick<TUI, "showOverlay" | "hideOverlay" | "hasOverlay" | "setFocus">;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createOverlayHandlers(host: OverlayHost, fallbackFocus: Component) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const openOverlay = (component: Component) => {
    host.showOverlay(component);
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const closeOverlay = () => {
    if (host.hasOverlay()) {
      host.hideOverlay();
      return;
    }
    host.setFocus(fallbackFocus);
  };

  return { openOverlay, closeOverlay };
}
