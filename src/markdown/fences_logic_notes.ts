/*
 * AUTO ANNOTATION
 * File: src/markdown/fences.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type FenceSpan = {
  start: number;
  end: number;
  openLine: string;
  marker: string;
  indent: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseFenceSpans(buffer: string): FenceSpan[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const spans: FenceSpan[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let open:
    | {
        start: number;
        markerChar: string;
        markerLen: number;
        openLine: string;
        marker: string;
        indent: string;
      }
    | undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let offset = 0;
  while (offset <= buffer.length) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const nextNewline = buffer.indexOf("\n", offset);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lineEnd = nextNewline === -1 ? buffer.length : nextNewline;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const line = buffer.slice(offset, lineEnd);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
    if (match) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const indent = match[1];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const marker = match[2];
      const markerChar = marker[0];
      const markerLen = marker.length;
      if (!open) {
        open = {
          start: offset,
          markerChar,
          markerLen,
          openLine: line,
          marker,
          indent,
        };
      } else if (open.markerChar === markerChar && markerLen >= open.markerLen) {
        const end = lineEnd;
        spans.push({
          start: open.start,
          end,
          openLine: open.openLine,
          marker: open.marker,
          indent: open.indent,
        });
        open = undefined;
      }
    }

    if (nextNewline === -1) {
      break;
    }
    offset = nextNewline + 1;
  }

  if (open) {
    spans.push({
      start: open.start,
      end: buffer.length,
      openLine: open.openLine,
      marker: open.marker,
      indent: open.indent,
    });
  }

  return spans;
}

export function findFenceSpanAt(spans: FenceSpan[], index: number): FenceSpan | undefined {
  return spans.find((span) => index > span.start && index < span.end);
}

export function isSafeFenceBreak(spans: FenceSpan[], index: number): boolean {
  return !findFenceSpanAt(spans, index);
}
