/*
 * AUTO ANNOTATION
 * File: src/commands/models/auth-order.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveAgentDir, resolveDefaultAgentId } from "../../agents/agent-scope.js";
import {
  type AuthProfileStore,
  ensureAuthProfileStore,
  setAuthProfileOrder,
} from "../../agents/auth-profiles.js";
import { normalizeProviderId } from "../../agents/model-selection.js";
import { loadConfig } from "../../config/config.js";
import type { RuntimeEnv } from "../../runtime.js";
import { shortenHomePath } from "../../utils.js";
import { resolveKnownAgentId } from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveTargetAgent(
  cfg: ReturnType<typeof loadConfig>,
  raw?: string,
): {
  agentId: string;
  agentDir: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentId = resolveKnownAgentId({ cfg, rawAgentId: raw }) ?? resolveDefaultAgentId(cfg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentDir = resolveAgentDir(cfg, agentId);
  return { agentId, agentDir };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function describeOrder(store: AuthProfileStore, provider: string): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerKey = normalizeProviderId(provider);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const order = store.order?.[providerKey];
  return Array.isArray(order) ? order : [];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAuthOrderContext(opts: { provider: string; agent?: string }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawProvider = opts.provider?.trim();
  if (!rawProvider) {
    throw new Error("Missing --provider.");
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const provider = normalizeProviderId(rawProvider);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = loadConfig();
  const { agentId, agentDir } = resolveTargetAgent(cfg, opts.agent);
  return { cfg, agentId, agentDir, provider };
}

export async function modelsAuthOrderGetCommand(
  opts: { provider: string; agent?: string; json?: boolean },
  runtime: RuntimeEnv,
) {
  const { agentId, agentDir, provider } = resolveAuthOrderContext(opts);
  const store = ensureAuthProfileStore(agentDir, {
    allowKeychainPrompt: false,
  });
  const order = describeOrder(store, provider);

  if (opts.json) {
    runtime.log(
      JSON.stringify(
        {
          agentId,
          agentDir,
          provider,
          authStorePath: shortenHomePath(`${agentDir}/auth-profiles.json`),
          order: order.length > 0 ? order : null,
        },
        null,
        2,
      ),
    );
    return;
  }

  runtime.log(`Agent: ${agentId}`);
  runtime.log(`Provider: ${provider}`);
  runtime.log(`Auth file: ${shortenHomePath(`${agentDir}/auth-profiles.json`)}`);
  runtime.log(order.length > 0 ? `Order override: ${order.join(", ")}` : "Order override: (none)");
}

export async function modelsAuthOrderClearCommand(
  opts: { provider: string; agent?: string },
  runtime: RuntimeEnv,
) {
  const { agentId, agentDir, provider } = resolveAuthOrderContext(opts);
  const updated = await setAuthProfileOrder({
    agentDir,
    provider,
    order: null,
  });
  if (!updated) {
    throw new Error("Failed to update auth-profiles.json (lock busy?).");
  }

  runtime.log(`Agent: ${agentId}`);
  runtime.log(`Provider: ${provider}`);
  runtime.log("Cleared per-agent order override.");
}

export async function modelsAuthOrderSetCommand(
  opts: { provider: string; agent?: string; order: string[] },
  runtime: RuntimeEnv,
) {
  const { agentId, agentDir, provider } = resolveAuthOrderContext(opts);

  const store = ensureAuthProfileStore(agentDir, {
    allowKeychainPrompt: false,
  });
  const providerKey = provider;
  const requested = (opts.order ?? []).map((entry) => String(entry).trim()).filter(Boolean);
  if (requested.length === 0) {
    throw new Error("Missing profile ids. Provide one or more profile ids.");
  }

  for (const profileId of requested) {
    const cred = store.profiles[profileId];
    if (!cred) {
      throw new Error(`Auth profile "${profileId}" not found in ${agentDir}.`);
    }
    if (normalizeProviderId(cred.provider) !== providerKey) {
      throw new Error(`Auth profile "${profileId}" is for ${cred.provider}, not ${provider}.`);
    }
  }

  const updated = await setAuthProfileOrder({
    agentDir,
    provider,
    order: requested,
  });
  if (!updated) {
    throw new Error("Failed to update auth-profiles.json (lock busy?).");
  }

  runtime.log(`Agent: ${agentId}`);
  runtime.log(`Provider: ${provider}`);
  runtime.log(`Order override: ${describeOrder(updated, provider).join(", ")}`);
}
