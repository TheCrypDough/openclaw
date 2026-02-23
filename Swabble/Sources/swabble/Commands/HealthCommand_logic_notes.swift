/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/swabble/Commands/HealthCommand.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Commander
import Foundation

@MainActor
struct HealthCommand: ParsableCommand {
    static var commandDescription: CommandDescription {
        CommandDescription(commandName: "health", abstract: "Health probe")
    }

    init() {}
    init(parsed: ParsedValues) {}

    mutating func run() async throws {
        print("ok")
    }
}
