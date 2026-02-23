# AUTOPLACEHOLDER_ANNOTATION: src/cli/program/config-guard.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { loadAndMaybeMigrateDoctorConfig } from "../../commands/doctor-config-flow.js";
import { readConfigFileSnapshot } from "../../config/config.js";
import type { RuntimeEnv } from "../../runtime.js";
import { colorize, isRich, theme } from "../../terminal/theme.js";
import { shortenHomePath } from "../../utils.js";
import { shouldMigrateStateFromPath } from "../argv.js";
import { formatCliCommand } from "../command-format.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ALLOWED_INVALID_COMMANDS = new Set(["doctor", "logs", "health", "help", "status"]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ALLOWED_INVALID_GATEWAY_SUBCOMMANDS = new Set([
  "status",
  "probe",
  "health",
  "discover",
  "call",
  "install",
  "uninstall",
  "start",
  "stop",
  "restart",
]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let didRunDoctorConfigFlow = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let configSnapshotPromise: Promise<Awaited<ReturnType<typeof readConfigFileSnapshot>>> | null =
  null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatConfigIssues(issues: Array<{ path: string; message: string }>): string[] {
  return issues.map((issue) => `- ${issue.path || "<root>"}: ${issue.message}`);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function getConfigSnapshot() {
  // Tests often mutate config fixtures; caching can make those flaky.
  if (process.env.VITEST === "true") {
    return readConfigFileSnapshot();
  }
  configSnapshotPromise ??= readConfigFileSnapshot();
  return configSnapshotPromise;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function ensureConfigReady(params: {
  runtime: RuntimeEnv;
  commandPath?: string[];
}): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const commandPath = params.commandPath ?? [];
  if (!didRunDoctorConfigFlow && shouldMigrateStateFromPath(commandPath)) {
    didRunDoctorConfigFlow = true;
    await loadAndMaybeMigrateDoctorConfig({
      options: { nonInteractive: true },
      confirm: async () => false,
    });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot = await getConfigSnapshot();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const commandName = commandPath[0];
  const subcommandName = commandPath[1];
  const allowInvalid = commandName
    ? ALLOWED_INVALID_COMMANDS.has(commandName) ||
      (commandName === "gateway" &&
        subcommandName &&
        ALLOWED_INVALID_GATEWAY_SUBCOMMANDS.has(subcommandName))
    : false;
  const issues = snapshot.exists && !snapshot.valid ? formatConfigIssues(snapshot.issues) : [];
  const legacyIssues =
    snapshot.legacyIssues.length > 0
      ? snapshot.legacyIssues.map((issue) => `- ${issue.path}: ${issue.message}`)
      : [];

  const invalid = snapshot.exists && !snapshot.valid;
  if (!invalid) {
    return;
  }

  const rich = isRich();
  const muted = (value: string) => colorize(rich, theme.muted, value);
  const error = (value: string) => colorize(rich, theme.error, value);
  const heading = (value: string) => colorize(rich, theme.heading, value);
  const commandText = (value: string) => colorize(rich, theme.command, value);

  params.runtime.error(heading("Config invalid"));
  params.runtime.error(`${muted("File:")} ${muted(shortenHomePath(snapshot.path))}`);
  if (issues.length > 0) {
    params.runtime.error(muted("Problem:"));
    params.runtime.error(issues.map((issue) => `  ${error(issue)}`).join("\n"));
  }
  if (legacyIssues.length > 0) {
    params.runtime.error(muted("Legacy config keys detected:"));
    params.runtime.error(legacyIssues.map((issue) => `  ${error(issue)}`).join("\n"));
  }
  params.runtime.error("");
  params.runtime.error(
    `${muted("Run:")} ${commandText(formatCliCommand("openclaw doctor --fix"))}`,
  );
  if (!allowInvalid) {
    params.runtime.exit(1);
  }
}
