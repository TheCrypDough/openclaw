/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/format.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { markdownToMatrixHtml } from "./format.js";

describe("markdownToMatrixHtml", () => {
  it("renders basic inline formatting", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const html = markdownToMatrixHtml("hi _there_ **boss** `code`");
    expect(html).toContain("<em>there</em>");
    expect(html).toContain("<strong>boss</strong>");
    expect(html).toContain("<code>code</code>");
  });

  it("renders links as HTML", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const html = markdownToMatrixHtml("see [docs](https://example.com)");
    expect(html).toContain('<a href="https://example.com">docs</a>');
  });

  it("escapes raw HTML", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const html = markdownToMatrixHtml("<b>nope</b>");
    expect(html).toContain("&lt;b&gt;nope&lt;/b&gt;");
    expect(html).not.toContain("<b>nope</b>");
  });

  it("flattens images into alt text", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const html = markdownToMatrixHtml("![alt](https://example.com/img.png)");
    expect(html).toContain("alt");
    expect(html).not.toContain("<img");
  });

  it("preserves line breaks", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const html = markdownToMatrixHtml("line1\nline2");
    expect(html).toContain("<br");
  });
});
