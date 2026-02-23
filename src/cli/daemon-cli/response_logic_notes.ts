/*
 * AUTO ANNOTATION
 * File: src/cli/daemon-cli/response.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Writable } from "node:stream";
import type { GatewayService } from "../../daemon/service.js";
import { defaultRuntime } from "../../runtime.js";

export type DaemonAction = "install" | "uninstall" | "start" | "stop" | "restart";

export type DaemonActionResponse = {
  ok: boolean;
  action: DaemonAction;
  result?: string;
  message?: string;
  error?: string;
  hints?: string[];
  warnings?: string[];
  service?: {
    label: string;
    loaded: boolean;
    loadedText: string;
    notLoadedText: string;
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function emitDaemonActionJson(payload: DaemonActionResponse) {
  defaultRuntime.log(JSON.stringify(payload, null, 2));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildDaemonServiceSnapshot(service: GatewayService, loaded: boolean) {
  return {
    label: service.label,
    loaded,
    loadedText: service.loadedText,
    notLoadedText: service.notLoadedText,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createNullWriter(): Writable {
  return new Writable({
    write(_chunk, _encoding, callback) {
      callback();
    },
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createDaemonActionContext(params: { action: DaemonAction; json: boolean }): {
  stdout: Writable;
  warnings: string[];
  emit: (payload: Omit<DaemonActionResponse, "action">) => void;
  fail: (message: string, hints?: string[]) => void;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const warnings: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stdout = params.json ? createNullWriter() : process.stdout;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const emit = (payload: Omit<DaemonActionResponse, "action">) => {
    if (!params.json) {
      return;
    }
    emitDaemonActionJson({
      action: params.action,
      ...payload,
      warnings: payload.warnings ?? (warnings.length ? warnings : undefined),
    });
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fail = (message: string, hints?: string[]) => {
    if (params.json) {
      emit({
        ok: false,
        error: message,
        hints,
      });
    } else {
      defaultRuntime.error(message);
      if (hints?.length) {
        for (const hint of hints) {
          defaultRuntime.log(`Tip: ${hint}`);
        }
      }
    }
    defaultRuntime.exit(1);
  };

  return { stdout, warnings, emit, fail };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function installDaemonServiceAndEmit(params: {
  serviceNoun: string;
  service: GatewayService;
  warnings: string[];
  emit: (payload: Omit<DaemonActionResponse, "action">) => void;
  fail: (message: string, hints?: string[]) => void;
  install: () => Promise<void>;
}) {
  try {
    await params.install();
  } catch (err) {
    params.fail(`${params.serviceNoun} install failed: ${String(err)}`);
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let installed = true;
  try {
    installed = await params.service.isLoaded({ env: process.env });
  } catch {
    installed = true;
  }
  params.emit({
    ok: true,
    result: "installed",
    service: buildDaemonServiceSnapshot(params.service, installed),
    warnings: params.warnings.length ? params.warnings : undefined,
  });
}
