/*
 * AUTO ANNOTATION
 * File: src/infra/npm-pack-install.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  type NpmIntegrityDrift,
  type NpmSpecResolution,
  packNpmSpecToArchive,
  withTempDir,
} from "./install-source-utils.js";
import {
  type NpmIntegrityDriftPayload,
  resolveNpmIntegrityDriftWithDefaultMessage,
} from "./npm-integrity.js";

export type NpmSpecArchiveInstallFlowResult<TResult extends { ok: boolean }> =
  | {
      ok: false;
      error: string;
    }
  | {
      ok: true;
      installResult: TResult;
      npmResolution: NpmSpecResolution;
      integrityDrift?: NpmIntegrityDrift;
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function installFromNpmSpecArchive<TResult extends { ok: boolean }>(params: {
  tempDirPrefix: string;
  spec: string;
  timeoutMs: number;
  expectedIntegrity?: string;
  onIntegrityDrift?: (payload: NpmIntegrityDriftPayload) => boolean | Promise<boolean>;
  warn?: (message: string) => void;
  installFromArchive: (params: { archivePath: string }) => Promise<TResult>;
}): Promise<NpmSpecArchiveInstallFlowResult<TResult>> {
  return await withTempDir(params.tempDirPrefix, async (tmpDir) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const packedResult = await packNpmSpecToArchive({
      spec: params.spec,
      timeoutMs: params.timeoutMs,
      cwd: tmpDir,
    });
    if (!packedResult.ok) {
      return packedResult;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const npmResolution: NpmSpecResolution = {
      ...packedResult.metadata,
      resolvedAt: new Date().toISOString(),
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const driftResult = await resolveNpmIntegrityDriftWithDefaultMessage({
      spec: params.spec,
      expectedIntegrity: params.expectedIntegrity,
      resolution: npmResolution,
      onIntegrityDrift: params.onIntegrityDrift,
      warn: params.warn,
    });
    if (driftResult.error) {
      return {
        ok: false,
        error: driftResult.error,
      };
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const installResult = await params.installFromArchive({
      archivePath: packedResult.archivePath,
    });

    return {
      ok: true,
      installResult,
      npmResolution,
      integrityDrift: driftResult.integrityDrift,
    };
  });
}
