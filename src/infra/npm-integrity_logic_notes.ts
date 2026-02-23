/*
 * AUTO ANNOTATION
 * File: src/infra/npm-integrity.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { NpmIntegrityDrift, NpmSpecResolution } from "./install-source-utils.js";

export type NpmIntegrityDriftPayload = {
  spec: string;
  expectedIntegrity: string;
  actualIntegrity: string;
  resolution: NpmSpecResolution;
};

type ResolveNpmIntegrityDriftParams<TPayload> = {
  spec: string;
  expectedIntegrity?: string;
  resolution: NpmSpecResolution;
  createPayload: (params: {
    spec: string;
    expectedIntegrity: string;
    actualIntegrity: string;
    resolution: NpmSpecResolution;
  }) => TPayload;
  onIntegrityDrift?: (payload: TPayload) => boolean | Promise<boolean>;
  warn?: (payload: TPayload) => void;
};

export type ResolveNpmIntegrityDriftResult<TPayload> = {
  integrityDrift?: NpmIntegrityDrift;
  proceed: boolean;
  payload?: TPayload;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveNpmIntegrityDrift<TPayload>(
  params: ResolveNpmIntegrityDriftParams<TPayload>,
): Promise<ResolveNpmIntegrityDriftResult<TPayload>> {
  if (!params.expectedIntegrity || !params.resolution.integrity) {
    return { proceed: true };
  }
  if (params.expectedIntegrity === params.resolution.integrity) {
    return { proceed: true };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const integrityDrift: NpmIntegrityDrift = {
    expectedIntegrity: params.expectedIntegrity,
    actualIntegrity: params.resolution.integrity,
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload = params.createPayload({
    spec: params.spec,
    expectedIntegrity: integrityDrift.expectedIntegrity,
    actualIntegrity: integrityDrift.actualIntegrity,
    resolution: params.resolution,
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let proceed = true;
  if (params.onIntegrityDrift) {
    proceed = await params.onIntegrityDrift(payload);
  } else {
    params.warn?.(payload);
  }

  return { integrityDrift, proceed, payload };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ResolveNpmIntegrityDriftWithDefaultMessageParams = {
  spec: string;
  expectedIntegrity?: string;
  resolution: NpmSpecResolution;
  onIntegrityDrift?: (payload: NpmIntegrityDriftPayload) => boolean | Promise<boolean>;
  warn?: (message: string) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveNpmIntegrityDriftWithDefaultMessage(
  params: ResolveNpmIntegrityDriftWithDefaultMessageParams,
): Promise<{ integrityDrift?: NpmIntegrityDrift; error?: string }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const driftResult = await resolveNpmIntegrityDrift<NpmIntegrityDriftPayload>({
    spec: params.spec,
    expectedIntegrity: params.expectedIntegrity,
    resolution: params.resolution,
    createPayload: (drift) => ({ ...drift }),
    onIntegrityDrift: params.onIntegrityDrift,
    warn: (driftPayload) => {
      params.warn?.(
        `Integrity drift detected for ${driftPayload.resolution.resolvedSpec ?? driftPayload.spec}: expected ${driftPayload.expectedIntegrity}, got ${driftPayload.actualIntegrity}`,
      );
    },
  });

  if (!driftResult.proceed && driftResult.payload) {
    return {
      integrityDrift: driftResult.integrityDrift,
      error: `aborted: npm package integrity drift detected for ${driftResult.payload.resolution.resolvedSpec ?? driftResult.payload.spec}`,
    };
  }

  return { integrityDrift: driftResult.integrityDrift };
}
