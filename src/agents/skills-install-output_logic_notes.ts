/*
 * AUTO ANNOTATION
 * File: src/agents/skills-install-output.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type InstallCommandResult = {
  code: number | null;
  stdout: string;
  stderr: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function summarizeInstallOutput(text: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = text.trim();
  if (!raw) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const preferred =
    lines.find((line) => /^error\b/i.test(line)) ??
    lines.find((line) => /\b(err!|error:|failed)\b/i.test(line)) ??
    lines.at(-1);

  if (!preferred) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = preferred.replace(/\s+/g, " ").trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxLen = 200;
  return normalized.length > maxLen ? `${normalized.slice(0, maxLen - 1)}…` : normalized;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatInstallFailureMessage(result: InstallCommandResult): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const code = typeof result.code === "number" ? `exit ${result.code}` : "unknown exit";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const summary = summarizeInstallOutput(result.stderr) ?? summarizeInstallOutput(result.stdout);
  if (!summary) {
    return `Install failed (${code})`;
  }
  return `Install failed (${code}): ${summary}`;
}
