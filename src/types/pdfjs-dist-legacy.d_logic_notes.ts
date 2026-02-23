/*
 * AUTO ANNOTATION
 * File: src/types/pdfjs-dist-legacy.d.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
declare module "pdfjs-dist/legacy/build/pdf.mjs" {
  export type TextItem = {
    str: string;
  };

  export type TextMarkedContent = {
    type?: string;
  };

  export type TextContent = {
    items: Array<TextItem | TextMarkedContent>;
  };

  export type Viewport = {
    width: number;
    height: number;
  };

  export type PDFPageProxy = {
    getTextContent(): Promise<TextContent>;
    getViewport(params: { scale: number }): Viewport;
    render(params: { canvas: unknown; viewport: Viewport }): { promise: Promise<void> };
  };

  export type PDFDocumentProxy = {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export function getDocument(params: { data: Uint8Array; disableWorker?: boolean }): {
    promise: Promise<PDFDocumentProxy>;
  };
}
