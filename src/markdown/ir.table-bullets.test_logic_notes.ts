/*
 * AUTO ANNOTATION
 * File: src/markdown/ir.table-bullets.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { markdownToIR } from "./ir.js";

describe("markdownToIR tableMode bullets", () => {
  it("converts simple table to bullets", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const md = `
| Name | Value |
|------|-------|
| A    | 1     |
| B    | 2     |
`.trim();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ir = markdownToIR(md, { tableMode: "bullets" });

    // Should contain bullet points with header:value format
    expect(ir.text).toContain("• Value: 1");
    expect(ir.text).toContain("• Value: 2");
    // Should use first column as labels
    expect(ir.text).toContain("A");
    expect(ir.text).toContain("B");
  });

  it("handles table with multiple columns", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const md = `
| Feature | SQLite | Postgres |
|---------|--------|----------|
| Speed   | Fast   | Medium   |
| Scale   | Small  | Large    |
`.trim();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ir = markdownToIR(md, { tableMode: "bullets" });

    // First column becomes row label
    expect(ir.text).toContain("Speed");
    expect(ir.text).toContain("Scale");
    // Other columns become bullet points
    expect(ir.text).toContain("• SQLite: Fast");
    expect(ir.text).toContain("• Postgres: Medium");
    expect(ir.text).toContain("• SQLite: Small");
    expect(ir.text).toContain("• Postgres: Large");
  });

  it("leaves table syntax untouched by default", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const md = `
| A | B |
|---|---|
| 1 | 2 |
`.trim();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ir = markdownToIR(md);

    // No table conversion by default
    expect(ir.text).toContain("| A | B |");
    expect(ir.text).toContain("| 1 | 2 |");
    expect(ir.text).not.toContain("•");
    expect(ir.styles.some((style) => style.style === "code_block")).toBe(false);
  });

  it("handles empty cells gracefully", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const md = `
| Name | Value |
|------|-------|
| A    |       |
| B    | 2     |
`.trim();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ir = markdownToIR(md, { tableMode: "bullets" });

    // Should handle empty cell without crashing
    expect(ir.text).toContain("B");
    expect(ir.text).toContain("• Value: 2");
  });

  it("bolds row labels in bullets mode", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const md = `
| Name | Value |
|------|-------|
| Row1 | Data1 |
`.trim();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ir = markdownToIR(md, { tableMode: "bullets" });

    // Should have bold style for row label
    const hasRowLabelBold = ir.styles.some(
      (s) => s.style === "bold" && ir.text.slice(s.start, s.end) === "Row1",
    );
    expect(hasRowLabelBold).toBe(true);
  });

  it("renders tables as code blocks in code mode", () => {
    const md = `
| A | B |
|---|---|
| 1 | 2 |
`.trim();

    const ir = markdownToIR(md, { tableMode: "code" });

    expect(ir.text).toContain("| A | B |");
    expect(ir.text).toContain("| 1 | 2 |");
    expect(ir.styles.some((style) => style.style === "code_block")).toBe(true);
  });

  it("preserves inline styles and links in bullets mode", () => {
    const md = `
| Name | Value |
|------|-------|
| _Row_ | [Link](https://example.com) |
`.trim();

    const ir = markdownToIR(md, { tableMode: "bullets" });

    const hasItalic = ir.styles.some(
      (s) => s.style === "italic" && ir.text.slice(s.start, s.end) === "Row",
    );
    expect(hasItalic).toBe(true);
    expect(ir.links.some((link) => link.href === "https://example.com")).toBe(true);
  });
});
