/*
 * AUTO ANNOTATION
 * File: src/media-understanding/format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MediaUnderstandingOutput } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MEDIA_PLACEHOLDER_RE = /^<media:[^>]+>(\s*\([^)]*\))?$/i;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MEDIA_PLACEHOLDER_TOKEN_RE = /^<media:[^>]+>(\s*\([^)]*\))?\s*/i;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractMediaUserText(body?: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = body?.trim() ?? "";
  if (!trimmed) {
    return undefined;
  }
  if (MEDIA_PLACEHOLDER_RE.test(trimmed)) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = trimmed.replace(MEDIA_PLACEHOLDER_TOKEN_RE, "").trim();
  return cleaned || undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatSection(
  title: string,
  kind: "Transcript" | "Description",
  text: string,
  userText?: string,
): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = [`[${title}]`];
  if (userText) {
    lines.push(`User text:\n${userText}`);
  }
  lines.push(`${kind}:\n${text}`);
  return lines.join("\n");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatMediaUnderstandingBody(params: {
  body?: string;
  outputs: MediaUnderstandingOutput[];
}): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const outputs = params.outputs.filter((output) => output.text.trim());
  if (outputs.length === 0) {
    return params.body ?? "";
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const userText = extractMediaUserText(params.body);
  const sections: string[] = [];
  if (userText && outputs.length > 1) {
    sections.push(`User text:\n${userText}`);
  }

  const counts = new Map<MediaUnderstandingOutput["kind"], number>();
  for (const output of outputs) {
    counts.set(output.kind, (counts.get(output.kind) ?? 0) + 1);
  }
  const seen = new Map<MediaUnderstandingOutput["kind"], number>();

  for (const output of outputs) {
    const count = counts.get(output.kind) ?? 1;
    const next = (seen.get(output.kind) ?? 0) + 1;
    seen.set(output.kind, next);
    const suffix = count > 1 ? ` ${next}/${count}` : "";
    if (output.kind === "audio.transcription") {
      sections.push(
        formatSection(
          `Audio${suffix}`,
          "Transcript",
          output.text,
          outputs.length === 1 ? userText : undefined,
        ),
      );
      continue;
    }
    if (output.kind === "image.description") {
      sections.push(
        formatSection(
          `Image${suffix}`,
          "Description",
          output.text,
          outputs.length === 1 ? userText : undefined,
        ),
      );
      continue;
    }
    sections.push(
      formatSection(
        `Video${suffix}`,
        "Description",
        output.text,
        outputs.length === 1 ? userText : undefined,
      ),
    );
  }

  return sections.join("\n\n").trim();
}

export function formatAudioTranscripts(outputs: MediaUnderstandingOutput[]): string {
  if (outputs.length === 1) {
    return outputs[0].text;
  }
  return outputs.map((output, index) => `Audio ${index + 1}:\n${output.text}`).join("\n\n");
}
