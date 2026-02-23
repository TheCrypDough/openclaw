/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/client/logging.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { ConsoleLogger, LogService } from "@vector-im/matrix-bot-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let matrixSdkLoggingConfigured = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const matrixSdkBaseLogger = new ConsoleLogger();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shouldSuppressMatrixHttpNotFound(module: string, messageOrObject: unknown[]): boolean {
  if (module !== "MatrixHttpClient") {
    return false;
  }
  return messageOrObject.some((entry) => {
    if (!entry || typeof entry !== "object") {
      return false;
    }
    return (entry as { errcode?: string }).errcode === "M_NOT_FOUND";
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ensureMatrixSdkLoggingConfigured(): void {
  if (matrixSdkLoggingConfigured) {
    return;
  }
  matrixSdkLoggingConfigured = true;

  LogService.setLogger({
    trace: (module, ...messageOrObject) => matrixSdkBaseLogger.trace(module, ...messageOrObject),
    debug: (module, ...messageOrObject) => matrixSdkBaseLogger.debug(module, ...messageOrObject),
    info: (module, ...messageOrObject) => matrixSdkBaseLogger.info(module, ...messageOrObject),
    warn: (module, ...messageOrObject) => matrixSdkBaseLogger.warn(module, ...messageOrObject),
    error: (module, ...messageOrObject) => {
      if (shouldSuppressMatrixHttpNotFound(module, messageOrObject)) {
        return;
      }
      matrixSdkBaseLogger.error(module, ...messageOrObject);
    },
  });
}
