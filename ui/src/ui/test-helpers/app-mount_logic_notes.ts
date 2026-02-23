/*
 * AUTO ANNOTATION
 * File: ui/src/ui/test-helpers/app-mount.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach } from "vitest";
import { OpenClawApp } from "../app.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mountApp(pathname: string) {
  window.history.replaceState({}, "", pathname);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const app = document.createElement("openclaw-app") as OpenClawApp;
  app.connect = () => {
    // no-op: avoid real gateway WS connections in browser tests
  };
  document.body.append(app);
  return app;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerAppMountHooks() {
  beforeEach(() => {
    window.__OPENCLAW_CONTROL_UI_BASE_PATH__ = undefined;
    localStorage.clear();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    window.__OPENCLAW_CONTROL_UI_BASE_PATH__ = undefined;
    localStorage.clear();
    document.body.innerHTML = "";
  });
}
