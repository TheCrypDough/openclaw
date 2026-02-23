# AUTOPLACEHOLDER_ANNOTATION: src/auto-reply/reply/config-value.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseConfigValue(raw: string): {
  value?: unknown;
  error?: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return { error: "Missing value." };
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return { value: JSON.parse(trimmed) };
    } catch (err) {
      return { error: `Invalid JSON: ${String(err)}` };
    }
  }

  if (trimmed === "true") {
    return { value: true };
  }
  if (trimmed === "false") {
    return { value: false };
  }
  if (trimmed === "null") {
    return { value: null };
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const num = Number(trimmed);
    if (Number.isFinite(num)) {
      return { value: num };
    }
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    try {
      return { value: JSON.parse(trimmed) };
    } catch {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const unquoted = trimmed.slice(1, -1);
      return { value: unquoted };
    }
  }

  return { value: trimmed };
}
