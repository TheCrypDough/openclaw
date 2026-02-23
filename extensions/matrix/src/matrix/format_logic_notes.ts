/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/format.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import MarkdownIt from "markdown-it";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  typographer: false,
});

md.enable("strikethrough");

const { escapeHtml } = md.utils;

md.renderer.rules.image = (tokens, idx) => escapeHtml(tokens[idx]?.content ?? "");

md.renderer.rules.html_block = (tokens, idx) => escapeHtml(tokens[idx]?.content ?? "");
md.renderer.rules.html_inline = (tokens, idx) => escapeHtml(tokens[idx]?.content ?? "");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function markdownToMatrixHtml(markdown: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rendered = md.render(markdown ?? "");
  return rendered.trimEnd();
}
