/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/TalkPromptBuilder.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
public enum TalkPromptBuilder: Sendable {
    public static func build(
        transcript: String,
        interruptedAtSeconds: Double?,
        includeVoiceDirectiveHint: Bool = true
    ) -> String {
        var lines: [String] = [
            "Talk Mode active. Reply in a concise, spoken tone.",
        ]

        if includeVoiceDirectiveHint {
            lines.append(
                "You may optionally prefix the response with JSON (first line) to set ElevenLabs voice (id or alias), e.g. {\"voice\":\"<id>\",\"once\":true}."
            )
        }

        if let interruptedAtSeconds {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let formatted = String(format: "%.1f", interruptedAtSeconds)
            lines.append("Assistant speech interrupted at \(formatted)s.")
        }

        lines.append("")
        lines.append(transcript)
        return lines.joined(separator: "\n")
    }
}
