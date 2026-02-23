/*
 * AUTO ANNOTATION
 * File: ui/src/ui/app-defaults.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { LogLevel } from "./types.ts";
import type { CronFormState } from "./ui-types.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_LOG_LEVEL_FILTERS: Record<LogLevel, boolean> = {
  trace: true,
  debug: true,
  info: true,
  warn: true,
  error: true,
  fatal: true,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_CRON_FORM: CronFormState = {
  name: "",
  description: "",
  agentId: "",
  enabled: true,
  scheduleKind: "every",
  scheduleAt: "",
  everyAmount: "30",
  everyUnit: "minutes",
  cronExpr: "0 7 * * *",
  cronTz: "",
  sessionTarget: "isolated",
  wakeMode: "now",
  payloadKind: "agentTurn",
  payloadText: "",
  deliveryMode: "announce",
  deliveryChannel: "last",
  deliveryTo: "",
  timeoutSeconds: "",
};
