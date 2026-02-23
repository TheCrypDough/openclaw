/*
 * AUTO ANNOTATION
 * File: src/plugins/source-display.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { formatPluginSourceForTable } from "./source-display.js";

describe("formatPluginSourceForTable", () => {
  it("shortens bundled plugin sources under the stock root", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const out = formatPluginSourceForTable(
      {
        origin: "bundled",
        source: "/opt/homebrew/lib/node_modules/openclaw/extensions/bluebubbles/index.ts",
      },
      {
        stock: "/opt/homebrew/lib/node_modules/openclaw/extensions",
        global: "/Users/x/.openclaw/extensions",
        workspace: "/Users/x/ws/.openclaw/extensions",
      },
    );
    expect(out.value).toBe("stock:bluebubbles/index.ts");
    expect(out.rootKey).toBe("stock");
  });

  it("shortens workspace plugin sources under the workspace root", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const out = formatPluginSourceForTable(
      {
        origin: "workspace",
        source: "/Users/x/ws/.openclaw/extensions/matrix/index.ts",
      },
      {
        stock: "/opt/homebrew/lib/node_modules/openclaw/extensions",
        global: "/Users/x/.openclaw/extensions",
        workspace: "/Users/x/ws/.openclaw/extensions",
      },
    );
    expect(out.value).toBe("workspace:matrix/index.ts");
    expect(out.rootKey).toBe("workspace");
  });

  it("shortens global plugin sources under the global root", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const out = formatPluginSourceForTable(
      {
        origin: "global",
        source: "/Users/x/.openclaw/extensions/zalo/index.js",
      },
      {
        stock: "/opt/homebrew/lib/node_modules/openclaw/extensions",
        global: "/Users/x/.openclaw/extensions",
        workspace: "/Users/x/ws/.openclaw/extensions",
      },
    );
    expect(out.value).toBe("global:zalo/index.js");
    expect(out.rootKey).toBe("global");
  });
});
