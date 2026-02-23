/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/SwabbleCore/Support/OutputFormat.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import CoreMedia
import Foundation

public enum OutputFormat: String {
    case txt
    case srt

    public var needsAudioTimeRange: Bool {
        switch self {
        case .srt: true
        default: false
        }
    }

    public func text(for transcript: AttributedString, maxLength: Int) -> String {
        switch self {
        case .txt:
            return String(transcript.characters)
        case .srt:
            func format(_ timeInterval: TimeInterval) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let ms = Int(timeInterval.truncatingRemainder(dividingBy: 1) * 1000)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let s = Int(timeInterval) % 60
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let m = (Int(timeInterval) / 60) % 60
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let h = Int(timeInterval) / 60 / 60
                return String(format: "%0.2d:%0.2d:%0.2d,%0.3d", h, m, s, ms)
            }

            return transcript.sentences(maxLength: maxLength).compactMap { (sentence: AttributedString) -> (
                CMTimeRange,
                String)? in
                guard let timeRange = sentence.audioTimeRange else { return nil }
                return (timeRange, String(sentence.characters))
            }.enumerated().map { index, run in
                let (timeRange, text) = run
                return """

                \(index + 1)
                \(format(timeRange.start.seconds)) --> \(format(timeRange.end.seconds))
                \(text.trimmingCharacters(in: .whitespacesAndNewlines))

                """
            }.joined().trimmingCharacters(in: .whitespacesAndNewlines)
        }
    }
}
