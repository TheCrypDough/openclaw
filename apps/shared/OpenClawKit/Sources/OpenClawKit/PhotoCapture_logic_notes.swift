/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/PhotoCapture.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

public enum PhotoCapture {
    public static func transcodeJPEGForGateway(
        rawData: Data,
        maxWidthPx: Int,
        quality: Double,
        maxPayloadBytes: Int = 5 * 1024 * 1024
    ) throws -> (data: Data, widthPx: Int, heightPx: Int) {
        // Base64 inflates payloads by ~4/3; cap encoded bytes so the payload stays under maxPayloadBytes (API limit).
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let maxEncodedBytes = (maxPayloadBytes / 4) * 3
        return try JPEGTranscoder.transcodeToJPEG(
            imageData: rawData,
            maxWidthPx: maxWidthPx,
            quality: quality,
            maxBytes: maxEncodedBytes)
    }
}

