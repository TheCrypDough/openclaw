/*
 * AUTO ANNOTATION
 * File: src/shared/net/ipv4.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateDottedDecimalIPv4Input(value: string | undefined): string | undefined {
  if (!value) {
    return "IP address is required for custom bind mode";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts = trimmed.split(".");
  if (parts.length !== 4) {
    return "Invalid IPv4 address (e.g., 192.168.1.100)";
  }
  if (
    parts.every((part) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const n = parseInt(part, 10);
      return !Number.isNaN(n) && n >= 0 && n <= 255 && part === String(n);
    })
  ) {
    return undefined;
  }
  return "Invalid IPv4 address (each octet must be 0-255)";
}

// Backward-compatible alias for callers using the old helper name.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateIPv4AddressInput(value: string | undefined): string | undefined {
  return validateDottedDecimalIPv4Input(value);
}
