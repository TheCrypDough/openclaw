/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/swabble/Commands/TailLogCommand.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Commander
import Foundation
import Swabble

@MainActor
struct TailLogCommand: ParsableCommand {
    static var commandDescription: CommandDescription {
        CommandDescription(commandName: "tail-log", abstract: "Tail recent transcripts")
    }

    init() {}
    init(parsed: ParsedValues) {}

    mutating func run() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let latest = await TranscriptsStore.shared.latest()
        for line in latest.suffix(10) {
            print(line)
        }
    }
}
