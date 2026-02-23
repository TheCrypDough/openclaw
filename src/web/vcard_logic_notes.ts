/*
 * AUTO ANNOTATION
 * File: src/web/vcard.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ParsedVcard = {
  name?: string;
  phones: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ALLOWED_VCARD_KEYS = new Set(["FN", "N", "TEL"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseVcard(vcard?: string): ParsedVcard {
  if (!vcard) {
    return { phones: [] };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = vcard.split(/\r?\n/);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let nameFromN: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let nameFromFn: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const phones: string[] = [];
  for (const rawLine of lines) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const line = rawLine.trim();
    if (!line) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = line.slice(0, colonIndex).toUpperCase();
    const rawValue = line.slice(colonIndex + 1).trim();
    if (!rawValue) {
      continue;
    }
    const baseKey = normalizeVcardKey(key);
    if (!baseKey || !ALLOWED_VCARD_KEYS.has(baseKey)) {
      continue;
    }
    const value = cleanVcardValue(rawValue);
    if (!value) {
      continue;
    }
    if (baseKey === "FN" && !nameFromFn) {
      nameFromFn = normalizeVcardName(value);
      continue;
    }
    if (baseKey === "N" && !nameFromN) {
      nameFromN = normalizeVcardName(value);
      continue;
    }
    if (baseKey === "TEL") {
      const phone = normalizeVcardPhone(value);
      if (phone) {
        phones.push(phone);
      }
    }
  }
  return { name: nameFromFn ?? nameFromN, phones };
}

function normalizeVcardKey(key: string): string | undefined {
  const [primary] = key.split(";");
  if (!primary) {
    return undefined;
  }
  const segments = primary.split(".");
  return segments[segments.length - 1] || undefined;
}

function cleanVcardValue(value: string): string {
  return value.replace(/\\n/gi, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").trim();
}

function normalizeVcardName(value: string): string {
  return value.replace(/;/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeVcardPhone(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.toLowerCase().startsWith("tel:")) {
    return trimmed.slice(4).trim();
  }
  return trimmed;
}
