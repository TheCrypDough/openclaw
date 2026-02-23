/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/CanvasScheme.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum CanvasScheme {
    static let scheme = "openclaw-canvas"
    static let allSchemes = [scheme]

    static func makeURL(session: String, path: String? = nil) -> URL? {
        var comps = URLComponents()
        comps.scheme = Self.scheme
        comps.host = session
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let p = (path ?? "/").trimmingCharacters(in: .whitespacesAndNewlines)
        if p.isEmpty || p == "/" {
            comps.path = "/"
        } else if p.hasPrefix("/") {
            comps.path = p
        } else {
            comps.path = "/" + p
        }
        return comps.url
    }

    static func mimeType(forExtension ext: String) -> String {
        switch ext.lowercased() {
        // Note: WKURLSchemeHandler uses URLResponse(mimeType:), which expects a bare MIME type
        // (no `; charset=...`). Encoding is provided via URLResponse(textEncodingName:).
        case "html", "htm": "text/html"
        case "js", "mjs": "application/javascript"
        case "css": "text/css"
        case "json", "map": "application/json"
        case "svg": "image/svg+xml"
        case "png": "image/png"
        case "jpg", "jpeg": "image/jpeg"
        case "gif": "image/gif"
        case "ico": "image/x-icon"
        case "woff2": "font/woff2"
        case "woff": "font/woff"
        case "ttf": "font/ttf"
        case "wasm": "application/wasm"
        default: "application/octet-stream"
        }
    }
}
