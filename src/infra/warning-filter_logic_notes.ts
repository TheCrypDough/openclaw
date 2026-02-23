/*
 * AUTO ANNOTATION
 * File: src/infra/warning-filter.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const warningFilterKey = Symbol.for("openclaw.warning-filter");

export type ProcessWarning = {
  code?: string;
  name?: string;
  message?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ProcessWarningInstallState = {
  installed: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function shouldIgnoreWarning(warning: ProcessWarning): boolean {
  if (warning.code === "DEP0040" && warning.message?.includes("punycode")) {
    return true;
  }
  if (warning.code === "DEP0060" && warning.message?.includes("util._extend")) {
    return true;
  }
  if (
    warning.name === "ExperimentalWarning" &&
    warning.message?.includes("SQLite is an experimental feature")
  ) {
    return true;
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeWarningArgs(args: unknown[]): ProcessWarning {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const warningArg = args[0];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const secondArg = args[1];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const thirdArg = args[2];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let name: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let code: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let message: string | undefined;

  if (warningArg instanceof Error) {
    name = warningArg.name;
    message = warningArg.message;
    code = (warningArg as Error & { code?: string }).code;
  } else if (typeof warningArg === "string") {
    message = warningArg;
  }

  if (secondArg && typeof secondArg === "object" && !Array.isArray(secondArg)) {
    const options = secondArg as { type?: unknown; code?: unknown };
    if (typeof options.type === "string") {
      name = options.type;
    }
    if (typeof options.code === "string") {
      code = options.code;
    }
  } else {
    if (typeof secondArg === "string") {
      name = secondArg;
    }
    if (typeof thirdArg === "string") {
      code = thirdArg;
    }
  }

  return { name, code, message };
}

export function installProcessWarningFilter(): void {
  const globalState = globalThis as typeof globalThis & {
    [warningFilterKey]?: ProcessWarningInstallState;
  };
  if (globalState[warningFilterKey]?.installed) {
    return;
  }

  const originalEmitWarning = process.emitWarning.bind(process);
  const wrappedEmitWarning: typeof process.emitWarning = ((...args: unknown[]) => {
    if (shouldIgnoreWarning(normalizeWarningArgs(args))) {
      return;
    }
    return Reflect.apply(originalEmitWarning, process, args);
  }) as typeof process.emitWarning;

  process.emitWarning = wrappedEmitWarning;
  globalState[warningFilterKey] = {
    installed: true,
  };
}
