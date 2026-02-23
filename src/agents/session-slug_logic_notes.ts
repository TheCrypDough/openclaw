/*
 * AUTO ANNOTATION
 * File: src/agents/session-slug.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SLUG_ADJECTIVES = [
  "amber",
  "briny",
  "brisk",
  "calm",
  "clear",
  "cool",
  "crisp",
  "dawn",
  "delta",
  "ember",
  "faint",
  "fast",
  "fresh",
  "gentle",
  "glow",
  "good",
  "grand",
  "keen",
  "kind",
  "lucky",
  "marine",
  "mellow",
  "mild",
  "neat",
  "nimble",
  "nova",
  "oceanic",
  "plaid",
  "quick",
  "quiet",
  "rapid",
  "salty",
  "sharp",
  "swift",
  "tender",
  "tidal",
  "tidy",
  "tide",
  "vivid",
  "warm",
  "wild",
  "young",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SLUG_NOUNS = [
  "atlas",
  "basil",
  "bison",
  "bloom",
  "breeze",
  "canyon",
  "cedar",
  "claw",
  "cloud",
  "comet",
  "coral",
  "cove",
  "crest",
  "crustacean",
  "daisy",
  "dune",
  "ember",
  "falcon",
  "fjord",
  "forest",
  "glade",
  "gulf",
  "harbor",
  "haven",
  "kelp",
  "lagoon",
  "lobster",
  "meadow",
  "mist",
  "nudibranch",
  "nexus",
  "ocean",
  "orbit",
  "otter",
  "pine",
  "prairie",
  "reef",
  "ridge",
  "river",
  "rook",
  "sable",
  "sage",
  "seaslug",
  "shell",
  "shoal",
  "shore",
  "slug",
  "summit",
  "tidepool",
  "trail",
  "valley",
  "wharf",
  "willow",
  "zephyr",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function randomChoice(values: string[], fallback: string) {
  return values[Math.floor(Math.random() * values.length)] ?? fallback;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createSlugBase(words = 2) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts = [randomChoice(SLUG_ADJECTIVES, "steady"), randomChoice(SLUG_NOUNS, "harbor")];
  if (words > 2) {
    parts.push(randomChoice(SLUG_NOUNS, "reef"));
  }
  return parts.join("-");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSessionSlug(isTaken?: (id: string) => boolean): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isIdTaken = isTaken ?? (() => false);
  for (let attempt = 0; attempt < 12; attempt += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = createSlugBase(2);
    if (!isIdTaken(base)) {
      return base;
    }
    for (let i = 2; i <= 12; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const candidate = `${base}-${i}`;
      if (!isIdTaken(candidate)) {
        return candidate;
      }
    }
  }
  for (let attempt = 0; attempt < 12; attempt += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = createSlugBase(3);
    if (!isIdTaken(base)) {
      return base;
    }
    for (let i = 2; i <= 12; i += 1) {
      const candidate = `${base}-${i}`;
      if (!isIdTaken(candidate)) {
        return candidate;
      }
    }
  }
  const fallback = `${createSlugBase(3)}-${Math.random().toString(36).slice(2, 5)}`;
  return isIdTaken(fallback) ? `${fallback}-${Date.now().toString(36)}` : fallback;
}
