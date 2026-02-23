/*
 * AUTO ANNOTATION
 * File: src/infra/npm-registry-spec.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateRegistryNpmSpec(rawSpec: string): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const spec = rawSpec.trim();
  if (!spec) {
    return "missing npm spec";
  }
  if (/\s/.test(spec)) {
    return "unsupported npm spec: whitespace is not allowed";
  }
  // Registry-only: no URLs, git, file, or alias protocols.
  // Keep strict: this runs on the gateway host.
  if (spec.includes("://")) {
    return "unsupported npm spec: URLs are not allowed";
  }
  if (spec.includes("#")) {
    return "unsupported npm spec: git refs are not allowed";
  }
  if (spec.includes(":")) {
    return "unsupported npm spec: protocol specs are not allowed";
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const at = spec.lastIndexOf("@");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasVersion = at > 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = hasVersion ? spec.slice(0, at) : spec;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const version = hasVersion ? spec.slice(at + 1) : "";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const unscopedName = /^[a-z0-9][a-z0-9-._~]*$/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scopedName = /^@[a-z0-9][a-z0-9-._~]*\/[a-z0-9][a-z0-9-._~]*$/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isValidName = name.startsWith("@") ? scopedName.test(name) : unscopedName.test(name);
  if (!isValidName) {
    return "unsupported npm spec: expected <name> or <name>@<version> from the npm registry";
  }
  if (hasVersion) {
    if (!version) {
      return "unsupported npm spec: missing version/tag after @";
    }
    if (/[\\/]/.test(version)) {
      return "unsupported npm spec: invalid version/tag";
    }
  }
  return null;
}
