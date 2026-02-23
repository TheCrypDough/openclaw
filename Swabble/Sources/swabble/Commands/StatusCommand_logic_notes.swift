/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/swabble/Commands/StatusCommand.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Commander
import Foundation
import Swabble

@MainActor
struct StatusCommand: ParsableCommand {
    static var commandDescription: CommandDescription {
        CommandDescription(commandName: "status", abstract: "Show daemon state")
    }

    @Option(name: .long("config"), help: "Path to config JSON") var configPath: String?

    init() {}
    init(parsed: ParsedValues) {
        self.init()
        if let cfg = parsed.options["config"]?.last { configPath = cfg }
    }

    mutating func run() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cfg = try? ConfigLoader.load(at: configURL)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let wake = cfg?.wake.word ?? "clawd"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let wakeEnabled = cfg?.wake.enabled ?? false
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let latest = await TranscriptsStore.shared.latest().suffix(3)
        print("wake: \(wakeEnabled ? wake : "disabled")")
        if latest.isEmpty {
            print("transcripts: (none yet)")
        } else {
            print("last transcripts:")
            latest.forEach { print("- \($0)") }
        }
    }

    private var configURL: URL? { configPath.map { URL(fileURLWithPath: $0) } }
}
