/*
 * AUTO ANNOTATION
 * File: src/browser/pw-tools-core.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let currentPage: Record<string, unknown> | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let currentRefLocator: Record<string, unknown> | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let pageState: {
  console: unknown[];
  armIdUpload: number;
  armIdDialog: number;
  armIdDownload: number;
} = {
  console: [],
  armIdUpload: 0,
  armIdDialog: 0,
  armIdDownload: 0,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const sessionMocks = vi.hoisted(() => ({
  getPageForTargetId: vi.fn(async () => {
    if (!currentPage) {
      throw new Error("missing page");
    }
    return currentPage;
  }),
  ensurePageState: vi.fn(() => pageState),
  restoreRoleRefsForTarget: vi.fn(() => {}),
  refLocator: vi.fn(() => {
    if (!currentRefLocator) {
      throw new Error("missing locator");
    }
    return currentRefLocator;
  }),
  rememberRoleRefsForTarget: vi.fn(() => {}),
}));

vi.mock("./pw-session.js", () => sessionMocks);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getPwToolsCoreSessionMocks() {
  return sessionMocks;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setPwToolsCoreCurrentPage(page: Record<string, unknown> | null) {
  currentPage = page;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setPwToolsCoreCurrentRefLocator(locator: Record<string, unknown> | null) {
  currentRefLocator = locator;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installPwToolsCoreTestHooks() {
  beforeEach(() => {
    currentPage = null;
    currentRefLocator = null;
    pageState = {
      console: [],
      armIdUpload: 0,
      armIdDialog: 0,
      armIdDownload: 0,
    };

    for (const fn of Object.values(sessionMocks)) {
      fn.mockClear();
    }
  });
}
