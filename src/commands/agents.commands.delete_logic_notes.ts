/*
 * AUTO ANNOTATION
 * File: src/commands/agents.commands.delete.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveAgentDir, resolveAgentWorkspaceDir } from "../agents/agent-scope.js";
import { writeConfigFile } from "../config/config.js";
import { logConfigUpdated } from "../config/logging.js";
import { resolveSessionTranscriptsDirForAgent } from "../config/sessions.js";
import { DEFAULT_AGENT_ID, normalizeAgentId } from "../routing/session-key.js";
import type { RuntimeEnv } from "../runtime.js";
import { defaultRuntime } from "../runtime.js";
import { createClackPrompter } from "../wizard/clack-prompter.js";
import { createQuietRuntime, requireValidConfig } from "./agents.command-shared.js";
import { findAgentEntryIndex, listAgentEntries, pruneAgentConfig } from "./agents.config.js";
import { moveToTrash } from "./onboard-helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AgentsDeleteOptions = {
  id: string;
  force?: boolean;
  json?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function agentsDeleteCommand(
  opts: AgentsDeleteOptions,
  runtime: RuntimeEnv = defaultRuntime,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = await requireValidConfig(runtime);
  if (!cfg) {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const input = opts.id?.trim();
  if (!input) {
    runtime.error("Agent id is required.");
    runtime.exit(1);
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentId = normalizeAgentId(input);
  if (agentId !== input) {
    runtime.log(`Normalized agent id to "${agentId}".`);
  }
  if (agentId === DEFAULT_AGENT_ID) {
    runtime.error(`"${DEFAULT_AGENT_ID}" cannot be deleted.`);
    runtime.exit(1);
    return;
  }

  if (findAgentEntryIndex(listAgentEntries(cfg), agentId) < 0) {
    runtime.error(`Agent "${agentId}" not found.`);
    runtime.exit(1);
    return;
  }

  if (!opts.force) {
    if (!process.stdin.isTTY) {
      runtime.error("Non-interactive session. Re-run with --force.");
      runtime.exit(1);
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prompter = createClackPrompter();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const confirmed = await prompter.confirm({
      message: `Delete agent "${agentId}" and prune workspace/state?`,
      initialValue: false,
    });
    if (!confirmed) {
      runtime.log("Cancelled.");
      return;
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentDir = resolveAgentDir(cfg, agentId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionsDir = resolveSessionTranscriptsDirForAgent(agentId);

  const result = pruneAgentConfig(cfg, agentId);
  await writeConfigFile(result.config);
  if (!opts.json) {
    logConfigUpdated(runtime);
  }

  const quietRuntime = opts.json ? createQuietRuntime(runtime) : runtime;
  await moveToTrash(workspaceDir, quietRuntime);
  await moveToTrash(agentDir, quietRuntime);
  await moveToTrash(sessionsDir, quietRuntime);

  if (opts.json) {
    runtime.log(
      JSON.stringify(
        {
          agentId,
          workspace: workspaceDir,
          agentDir,
          sessionsDir,
          removedBindings: result.removedBindings,
          removedAllow: result.removedAllow,
        },
        null,
        2,
      ),
    );
  } else {
    runtime.log(`Deleted agent: ${agentId}`);
  }
}
