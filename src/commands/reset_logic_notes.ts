/*
 * AUTO ANNOTATION
 * File: src/commands/reset.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { cancel, confirm, isCancel } from "@clack/prompts";
import { formatCliCommand } from "../cli/command-format.js";
import { isNixMode } from "../config/config.js";
import { resolveGatewayService } from "../daemon/service.js";
import type { RuntimeEnv } from "../runtime.js";
import { selectStyled } from "../terminal/prompt-select-styled.js";
import { stylePromptMessage, stylePromptTitle } from "../terminal/prompt-style.js";
import { resolveCleanupPlanFromDisk } from "./cleanup-plan.js";
import { listAgentSessionDirs, removePath } from "./cleanup-utils.js";

export type ResetScope = "config" | "config+creds+sessions" | "full";

export type ResetOptions = {
  scope?: ResetScope;
  yes?: boolean;
  nonInteractive?: boolean;
  dryRun?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function stopGatewayIfRunning(runtime: RuntimeEnv) {
  if (isNixMode) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const service = resolveGatewayService();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let loaded = false;
  try {
    loaded = await service.isLoaded({ env: process.env });
  } catch (err) {
    runtime.error(`Gateway service check failed: ${String(err)}`);
    return;
  }
  if (!loaded) {
    return;
  }
  try {
    await service.stop({ env: process.env, stdout: process.stdout });
  } catch (err) {
    runtime.error(`Gateway stop failed: ${String(err)}`);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resetCommand(runtime: RuntimeEnv, opts: ResetOptions) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const interactive = !opts.nonInteractive;
  if (!interactive && !opts.yes) {
    runtime.error("Non-interactive mode requires --yes.");
    runtime.exit(1);
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let scope = opts.scope;
  if (!scope) {
    if (!interactive) {
      runtime.error("Non-interactive mode requires --scope.");
      runtime.exit(1);
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const selection = await selectStyled<ResetScope>({
      message: "Reset scope",
      options: [
        {
          value: "config",
          label: "Config only",
          hint: "openclaw.json",
        },
        {
          value: "config+creds+sessions",
          label: "Config + credentials + sessions",
          hint: "keeps workspace + auth profiles",
        },
        {
          value: "full",
          label: "Full reset",
          hint: "state dir + workspace",
        },
      ],
      initialValue: "config+creds+sessions",
    });
    if (isCancel(selection)) {
      cancel(stylePromptTitle("Reset cancelled.") ?? "Reset cancelled.");
      runtime.exit(0);
      return;
    }
    scope = selection;
  }

  if (!["config", "config+creds+sessions", "full"].includes(scope)) {
    runtime.error('Invalid --scope. Expected "config", "config+creds+sessions", or "full".');
    runtime.exit(1);
    return;
  }

  if (interactive && !opts.yes) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ok = await confirm({
      message: stylePromptMessage(`Proceed with ${scope} reset?`),
    });
    if (isCancel(ok) || !ok) {
      cancel(stylePromptTitle("Reset cancelled.") ?? "Reset cancelled.");
      runtime.exit(0);
      return;
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dryRun = Boolean(opts.dryRun);
  const { stateDir, configPath, oauthDir, configInsideState, oauthInsideState, workspaceDirs } =
    resolveCleanupPlanFromDisk();

  if (scope !== "config") {
    if (dryRun) {
      runtime.log("[dry-run] stop gateway service");
    } else {
      await stopGatewayIfRunning(runtime);
    }
  }

  if (scope === "config") {
    await removePath(configPath, runtime, { dryRun, label: configPath });
    return;
  }

  if (scope === "config+creds+sessions") {
    await removePath(configPath, runtime, { dryRun, label: configPath });
    await removePath(oauthDir, runtime, { dryRun, label: oauthDir });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionDirs = await listAgentSessionDirs(stateDir);
    for (const dir of sessionDirs) {
      await removePath(dir, runtime, { dryRun, label: dir });
    }
    runtime.log(`Next: ${formatCliCommand("openclaw onboard --install-daemon")}`);
    return;
  }

  if (scope === "full") {
    await removePath(stateDir, runtime, { dryRun, label: stateDir });
    if (!configInsideState) {
      await removePath(configPath, runtime, { dryRun, label: configPath });
    }
    if (!oauthInsideState) {
      await removePath(oauthDir, runtime, { dryRun, label: oauthDir });
    }
    for (const workspace of workspaceDirs) {
      await removePath(workspace, runtime, { dryRun, label: workspace });
    }
    runtime.log(`Next: ${formatCliCommand("openclaw onboard --install-daemon")}`);
    return;
  }
}
