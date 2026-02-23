/*
 * AUTO ANNOTATION
 * File: src/tui/tui-waiting.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MinimalTheme = {
  dim: (s: string) => string;
  bold: (s: string) => string;
  accentSoft: (s: string) => string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const defaultWaitingPhrases = [
  "flibbertigibbeting",
  "kerfuffling",
  "dillydallying",
  "twiddling thumbs",
  "noodling",
  "bamboozling",
  "moseying",
  "hobnobbing",
  "pondering",
  "conjuring",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function pickWaitingPhrase(tick: number, phrases = defaultWaitingPhrases) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const idx = Math.floor(tick / 10) % phrases.length;
  return phrases[idx] ?? phrases[0] ?? "waiting";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function shimmerText(theme: MinimalTheme, text: string, tick: number) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const width = 6;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hi = (ch: string) => theme.bold(theme.accentSoft(ch));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pos = tick % (text.length + width);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const start = Math.max(0, pos - width);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const end = Math.min(text.length - 1, pos);

  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    out += i >= start && i <= end ? hi(ch) : theme.dim(ch);
  }
  return out;
}

export function buildWaitingStatusMessage(params: {
  theme: MinimalTheme;
  tick: number;
  elapsed: string;
  connectionStatus: string;
  phrases?: string[];
}) {
  const phrase = pickWaitingPhrase(params.tick, params.phrases);
  const cute = shimmerText(params.theme, `${phrase}…`, params.tick);
  return `${cute} • ${params.elapsed} | ${params.connectionStatus}`;
}
