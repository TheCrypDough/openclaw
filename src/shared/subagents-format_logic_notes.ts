/*
 * AUTO ANNOTATION
 * File: src/shared/subagents-format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatDurationCompact(valueMs?: number) {
  if (!valueMs || !Number.isFinite(valueMs) || valueMs <= 0) {
    return "n/a";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const minutes = Math.max(1, Math.round(valueMs / 60_000));
  if (minutes < 60) {
    return `${minutes}m`;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hours = Math.floor(minutes / 60);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const minutesRemainder = minutes % 60;
  if (hours < 24) {
    return minutesRemainder > 0 ? `${hours}h${minutesRemainder}m` : `${hours}h`;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const days = Math.floor(hours / 24);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hoursRemainder = hours % 24;
  return hoursRemainder > 0 ? `${days}d${hoursRemainder}h` : `${days}d`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatTokenShort(value?: number) {
  if (!value || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const n = Math.floor(value);
  if (n < 1_000) {
    return `${n}`;
  }
  if (n < 10_000) {
    return `${(n / 1_000).toFixed(1).replace(/\\.0$/, "")}k`;
  }
  if (n < 1_000_000) {
    return `${Math.round(n / 1_000)}k`;
  }
  return `${(n / 1_000_000).toFixed(1).replace(/\\.0$/, "")}m`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function truncateLine(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export type TokenUsageLike = {
  totalTokens?: unknown;
  inputTokens?: unknown;
  outputTokens?: unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTotalTokens(entry?: TokenUsageLike) {
  if (!entry || typeof entry !== "object") {
    return undefined;
  }
  if (typeof entry.totalTokens === "number" && Number.isFinite(entry.totalTokens)) {
    return entry.totalTokens;
  }
  const input = typeof entry.inputTokens === "number" ? entry.inputTokens : 0;
  const output = typeof entry.outputTokens === "number" ? entry.outputTokens : 0;
  const total = input + output;
  return total > 0 ? total : undefined;
}

export function resolveIoTokens(entry?: TokenUsageLike) {
  if (!entry || typeof entry !== "object") {
    return undefined;
  }
  const input =
    typeof entry.inputTokens === "number" && Number.isFinite(entry.inputTokens)
      ? entry.inputTokens
      : 0;
  const output =
    typeof entry.outputTokens === "number" && Number.isFinite(entry.outputTokens)
      ? entry.outputTokens
      : 0;
  const total = input + output;
  if (total <= 0) {
    return undefined;
  }
  return { input, output, total };
}

export function formatTokenUsageDisplay(entry?: TokenUsageLike) {
  const io = resolveIoTokens(entry);
  const promptCache = resolveTotalTokens(entry);
  const parts: string[] = [];
  if (io) {
    const input = formatTokenShort(io.input) ?? "0";
    const output = formatTokenShort(io.output) ?? "0";
    parts.push(`tokens ${formatTokenShort(io.total)} (in ${input} / out ${output})`);
  } else if (typeof promptCache === "number" && promptCache > 0) {
    parts.push(`tokens ${formatTokenShort(promptCache)} prompt/cache`);
  }
  if (typeof promptCache === "number" && io && promptCache > io.total) {
    parts.push(`prompt/cache ${formatTokenShort(promptCache)}`);
  }
  return parts.join(", ");
}
