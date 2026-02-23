/*
 * AUTO ANNOTATION
 * File: src/memory/embedding-manager.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, expect } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { getEmbedBatchMock, resetEmbeddingMocks } from "./embedding.test-mocks.js";
import {
  getMemorySearchManager,
  type MemoryIndexManager,
  type MemorySearchManager,
} from "./index.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installEmbeddingManagerFixture(opts: {
  fixturePrefix: string;
  largeTokens: number;
  smallTokens: number;
  createCfg: (params: {
    workspaceDir: string;
    indexPath: string;
    tokens: number;
  }) => OpenClawConfig;
  resetIndexEachTest?: boolean;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const embedBatch = getEmbedBatchMock();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resetIndexEachTest = opts.resetIndexEachTest ?? true;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let fixtureRoot: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let workspaceDir: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let memoryDir: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let managerLarge: MemoryIndexManager | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let managerSmall: MemoryIndexManager | undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resetManager = (manager: MemoryIndexManager) => {
    (manager as unknown as { resetIndex: () => void }).resetIndex();
    (manager as unknown as { dirty: boolean }).dirty = true;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requireValue = <T>(value: T | undefined, name: string): T => {
    if (!value) {
      throw new Error(`${name} missing`);
    }
    return value;
  };

  const requireIndexManager = (
    manager: MemorySearchManager | null,
    name: string,
  ): MemoryIndexManager => {
    if (!manager) {
      throw new Error(`${name} missing`);
    }
    if (!("resetIndex" in manager) || typeof manager.resetIndex !== "function") {
      throw new Error(`${name} is not a MemoryIndexManager`);
    }
    return manager as unknown as MemoryIndexManager;
  };

  beforeAll(async () => {
    fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), opts.fixturePrefix));
    workspaceDir = path.join(fixtureRoot, "workspace");
    memoryDir = path.join(workspaceDir, "memory");
    await fs.mkdir(memoryDir, { recursive: true });

    const indexPathLarge = path.join(fixtureRoot, "index.large.sqlite");
    const indexPathSmall = path.join(fixtureRoot, "index.small.sqlite");

    const large = await getMemorySearchManager({
      cfg: opts.createCfg({
        workspaceDir,
        indexPath: indexPathLarge,
        tokens: opts.largeTokens,
      }),
      agentId: "main",
    });
    expect(large.manager).not.toBeNull();
    managerLarge = requireIndexManager(large.manager, "managerLarge");

    const small = await getMemorySearchManager({
      cfg: opts.createCfg({
        workspaceDir,
        indexPath: indexPathSmall,
        tokens: opts.smallTokens,
      }),
      agentId: "main",
    });
    expect(small.manager).not.toBeNull();
    managerSmall = requireIndexManager(small.manager, "managerSmall");
  });

  afterAll(async () => {
    if (managerLarge) {
      await managerLarge.close();
      managerLarge = undefined;
    }
    if (managerSmall) {
      await managerSmall.close();
      managerSmall = undefined;
    }
    if (fixtureRoot) {
      await fs.rm(fixtureRoot, { recursive: true, force: true });
      fixtureRoot = undefined;
    }
  });

  beforeEach(async () => {
    resetEmbeddingMocks();

    const dir = requireValue(memoryDir, "memoryDir");
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });

    if (resetIndexEachTest) {
      resetManager(requireValue(managerLarge, "managerLarge"));
      resetManager(requireValue(managerSmall, "managerSmall"));
    }
  });

  return {
    embedBatch,
    getFixtureRoot: () => requireValue(fixtureRoot, "fixtureRoot"),
    getWorkspaceDir: () => requireValue(workspaceDir, "workspaceDir"),
    getMemoryDir: () => requireValue(memoryDir, "memoryDir"),
    getManagerLarge: () => requireValue(managerLarge, "managerLarge"),
    getManagerSmall: () => requireValue(managerSmall, "managerSmall"),
    resetManager,
  };
}
