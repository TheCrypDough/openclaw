/*
 * AUTO ANNOTATION
 * File: src/markdown/code-spans.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseFenceSpans, type FenceSpan } from "./fences.js";

export type InlineCodeState = {
  open: boolean;
  ticks: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createInlineCodeState(): InlineCodeState {
  return { open: false, ticks: 0 };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type InlineCodeSpansResult = {
  spans: Array<[number, number]>;
  state: InlineCodeState;
};

export type CodeSpanIndex = {
  inlineState: InlineCodeState;
  isInside: (index: number) => boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildCodeSpanIndex(text: string, inlineState?: InlineCodeState): CodeSpanIndex {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fenceSpans = parseFenceSpans(text);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const startState = inlineState
    ? { open: inlineState.open, ticks: inlineState.ticks }
    : createInlineCodeState();
  const { spans: inlineSpans, state: nextInlineState } = parseInlineCodeSpans(
    text,
    fenceSpans,
    startState,
  );

  return {
    inlineState: nextInlineState,
    isInside: (index: number) =>
      isInsideFenceSpan(index, fenceSpans) || isInsideInlineSpan(index, inlineSpans),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseInlineCodeSpans(
  text: string,
  fenceSpans: FenceSpan[],
  initialState: InlineCodeState,
): InlineCodeSpansResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const spans: Array<[number, number]> = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let open = initialState.open;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let ticks = initialState.ticks;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let openStart = open ? 0 : -1;

  let i = 0;
  while (i < text.length) {
    const fence = findFenceSpanAtInclusive(fenceSpans, i);
    if (fence) {
      i = fence.end;
      continue;
    }

    if (text[i] !== "`") {
      i += 1;
      continue;
    }

    const runStart = i;
    let runLength = 0;
    while (i < text.length && text[i] === "`") {
      runLength += 1;
      i += 1;
    }

    if (!open) {
      open = true;
      ticks = runLength;
      openStart = runStart;
      continue;
    }

    if (runLength === ticks) {
      spans.push([openStart, i]);
      open = false;
      ticks = 0;
      openStart = -1;
    }
  }

  if (open) {
    spans.push([openStart, text.length]);
  }

  return {
    spans,
    state: { open, ticks },
  };
}

function findFenceSpanAtInclusive(spans: FenceSpan[], index: number): FenceSpan | undefined {
  return spans.find((span) => index >= span.start && index < span.end);
}

function isInsideFenceSpan(index: number, spans: FenceSpan[]): boolean {
  return spans.some((span) => index >= span.start && index < span.end);
}

function isInsideInlineSpan(index: number, spans: Array<[number, number]>): boolean {
  return spans.some(([start, end]) => index >= start && index < end);
}
