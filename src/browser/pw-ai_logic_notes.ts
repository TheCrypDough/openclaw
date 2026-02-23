/*
 * AUTO ANNOTATION
 * File: src/browser/pw-ai.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { markPwAiLoaded } from "./pw-ai-state.js";

markPwAiLoaded();

export {
  type BrowserConsoleMessage,
  closePageByTargetIdViaPlaywright,
  closePlaywrightBrowserConnection,
  createPageViaPlaywright,
  ensurePageState,
  forceDisconnectPlaywrightForTarget,
  focusPageByTargetIdViaPlaywright,
  getPageForTargetId,
  listPagesViaPlaywright,
  refLocator,
  type WithSnapshotForAI,
} from "./pw-session.js";

export {
  armDialogViaPlaywright,
  armFileUploadViaPlaywright,
  clickViaPlaywright,
  closePageViaPlaywright,
  cookiesClearViaPlaywright,
  cookiesGetViaPlaywright,
  cookiesSetViaPlaywright,
  downloadViaPlaywright,
  dragViaPlaywright,
  emulateMediaViaPlaywright,
  evaluateViaPlaywright,
  fillFormViaPlaywright,
  getConsoleMessagesViaPlaywright,
  getNetworkRequestsViaPlaywright,
  getPageErrorsViaPlaywright,
  highlightViaPlaywright,
  hoverViaPlaywright,
  navigateViaPlaywright,
  pdfViaPlaywright,
  pressKeyViaPlaywright,
  resizeViewportViaPlaywright,
  responseBodyViaPlaywright,
  scrollIntoViewViaPlaywright,
  selectOptionViaPlaywright,
  setDeviceViaPlaywright,
  setExtraHTTPHeadersViaPlaywright,
  setGeolocationViaPlaywright,
  setHttpCredentialsViaPlaywright,
  setInputFilesViaPlaywright,
  setLocaleViaPlaywright,
  setOfflineViaPlaywright,
  setTimezoneViaPlaywright,
  snapshotAiViaPlaywright,
  snapshotAriaViaPlaywright,
  snapshotRoleViaPlaywright,
  screenshotWithLabelsViaPlaywright,
  storageClearViaPlaywright,
  storageGetViaPlaywright,
  storageSetViaPlaywright,
  takeScreenshotViaPlaywright,
  traceStartViaPlaywright,
  traceStopViaPlaywright,
  typeViaPlaywright,
  waitForDownloadViaPlaywright,
  waitForViaPlaywright,
} from "./pw-tools-core.js";
