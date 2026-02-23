/*
 * AUTO ANNOTATION
 * File: src/agents/sandbox/manage.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { stopBrowserBridgeServer } from "../../browser/bridge-server.js";
import { loadConfig } from "../../config/config.js";
import { BROWSER_BRIDGES } from "./browser-bridges.js";
import { resolveSandboxConfigForAgent } from "./config.js";
import { dockerContainerState, execDocker } from "./docker.js";
import {
  readBrowserRegistry,
  readRegistry,
  removeBrowserRegistryEntry,
  removeRegistryEntry,
  type SandboxBrowserRegistryEntry,
  type SandboxRegistryEntry,
} from "./registry.js";
import { resolveSandboxAgentId } from "./shared.js";

export type SandboxContainerInfo = SandboxRegistryEntry & {
  running: boolean;
  imageMatch: boolean;
};

export type SandboxBrowserInfo = SandboxBrowserRegistryEntry & {
  running: boolean;
  imageMatch: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function listSandboxRegistryItems<
  TEntry extends { containerName: string; image: string; sessionKey: string },
>(params: {
  read: () => Promise<{ entries: TEntry[] }>;
  resolveConfiguredImage: (agentId?: string) => string;
}): Promise<Array<TEntry & { running: boolean; imageMatch: boolean }>> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const registry = await params.read();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const results: Array<TEntry & { running: boolean; imageMatch: boolean }> = [];

  for (const entry of registry.entries) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const state = await dockerContainerState(entry.containerName);
    // Get actual image from container.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let actualImage = entry.image;
    if (state.exists) {
      try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const result = await execDocker(
          ["inspect", "-f", "{{.Config.Image}}", entry.containerName],
          { allowFailure: true },
        );
        if (result.code === 0) {
          actualImage = result.stdout.trim();
        }
      } catch {
        // ignore
      }
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentId = resolveSandboxAgentId(entry.sessionKey);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const configuredImage = params.resolveConfiguredImage(agentId);
    results.push({
      ...entry,
      image: actualImage,
      running: state.running,
      imageMatch: actualImage === configuredImage,
    });
  }

  return results;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function listSandboxContainers(): Promise<SandboxContainerInfo[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const config = loadConfig();
  return listSandboxRegistryItems<SandboxRegistryEntry>({
    read: readRegistry,
    resolveConfiguredImage: (agentId) => resolveSandboxConfigForAgent(config, agentId).docker.image,
  });
}

export async function listSandboxBrowsers(): Promise<SandboxBrowserInfo[]> {
  const config = loadConfig();
  return listSandboxRegistryItems<SandboxBrowserRegistryEntry>({
    read: readBrowserRegistry,
    resolveConfiguredImage: (agentId) =>
      resolveSandboxConfigForAgent(config, agentId).browser.image,
  });
}

export async function removeSandboxContainer(containerName: string): Promise<void> {
  try {
    await execDocker(["rm", "-f", containerName], { allowFailure: true });
  } catch {
    // ignore removal failures
  }
  await removeRegistryEntry(containerName);
}

export async function removeSandboxBrowserContainer(containerName: string): Promise<void> {
  try {
    await execDocker(["rm", "-f", containerName], { allowFailure: true });
  } catch {
    // ignore removal failures
  }
  await removeBrowserRegistryEntry(containerName);

  // Stop browser bridge if active
  for (const [sessionKey, bridge] of BROWSER_BRIDGES.entries()) {
    if (bridge.containerName === containerName) {
      await stopBrowserBridgeServer(bridge.bridge.server).catch(() => undefined);
      BROWSER_BRIDGES.delete(sessionKey);
    }
  }
}
