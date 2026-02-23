/*
 * AUTO ANNOTATION
 * File: src/shared/frontmatter.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import JSON5 from "json5";
import { LEGACY_MANIFEST_KEYS, MANIFEST_KEY } from "../compat/legacy-names.js";
import { parseBooleanValue } from "../utils/boolean.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeStringList(input: unknown): string[] {
  if (!input) {
    return [];
  }
  if (Array.isArray(input)) {
    return input.map((value) => String(value).trim()).filter(Boolean);
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }
  return [];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getFrontmatterString(
  frontmatter: Record<string, unknown>,
  key: string,
): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = frontmatter[key];
  return typeof raw === "string" ? raw : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseFrontmatterBool(value: string | undefined, fallback: boolean): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = parseBooleanValue(value);
  return parsed === undefined ? fallback : parsed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveOpenClawManifestBlock(params: {
  frontmatter: Record<string, unknown>;
  key?: string;
}): Record<string, unknown> | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = getFrontmatterString(params.frontmatter, params.key ?? "metadata");
  if (!raw) {
    return undefined;
  }

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON5.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return undefined;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const manifestKeys = [MANIFEST_KEY, ...LEGACY_MANIFEST_KEYS];
    for (const key of manifestKeys) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const candidate = (parsed as Record<string, unknown>)[key];
      if (candidate && typeof candidate === "object") {
        return candidate as Record<string, unknown>;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export type OpenClawManifestRequires = {
  bins: string[];
  anyBins: string[];
  env: string[];
  config: string[];
};

export function resolveOpenClawManifestRequires(
  metadataObj: Record<string, unknown>,
): OpenClawManifestRequires | undefined {
  const requiresRaw =
    typeof metadataObj.requires === "object" && metadataObj.requires !== null
      ? (metadataObj.requires as Record<string, unknown>)
      : undefined;
  if (!requiresRaw) {
    return undefined;
  }
  return {
    bins: normalizeStringList(requiresRaw.bins),
    anyBins: normalizeStringList(requiresRaw.anyBins),
    env: normalizeStringList(requiresRaw.env),
    config: normalizeStringList(requiresRaw.config),
  };
}

export function resolveOpenClawManifestInstall<T>(
  metadataObj: Record<string, unknown>,
  parseInstallSpec: (input: unknown) => T | undefined,
): T[] {
  const installRaw = Array.isArray(metadataObj.install) ? (metadataObj.install as unknown[]) : [];
  return installRaw
    .map((entry) => parseInstallSpec(entry))
    .filter((entry): entry is T => Boolean(entry));
}

export function resolveOpenClawManifestOs(metadataObj: Record<string, unknown>): string[] {
  return normalizeStringList(metadataObj.os);
}

export type ParsedOpenClawManifestInstallBase = {
  raw: Record<string, unknown>;
  kind: string;
  id?: string;
  label?: string;
  bins?: string[];
};

export function parseOpenClawManifestInstallBase(
  input: unknown,
  allowedKinds: readonly string[],
): ParsedOpenClawManifestInstallBase | undefined {
  if (!input || typeof input !== "object") {
    return undefined;
  }
  const raw = input as Record<string, unknown>;
  const kindRaw =
    typeof raw.kind === "string" ? raw.kind : typeof raw.type === "string" ? raw.type : "";
  const kind = kindRaw.trim().toLowerCase();
  if (!allowedKinds.includes(kind)) {
    return undefined;
  }

  const spec: ParsedOpenClawManifestInstallBase = {
    raw,
    kind,
  };
  if (typeof raw.id === "string") {
    spec.id = raw.id;
  }
  if (typeof raw.label === "string") {
    spec.label = raw.label;
  }
  const bins = normalizeStringList(raw.bins);
  if (bins.length > 0) {
    spec.bins = bins;
  }
  return spec;
}
