/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/swabble/Commands/SetupCommand.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Commander
import Foundation
import Swabble

@MainActor
struct SetupCommand: ParsableCommand {
    static var commandDescription: CommandDescription {
        CommandDescription(commandName: "setup", abstract: "Write default config")
    }

    @Option(name: .long("config"), help: "Path to config JSON") var configPath: String?

    init() {}
    init(parsed: ParsedValues) {
        self.init()
        if let cfg = parsed.options["config"]?.last { configPath = cfg }
    }

    mutating func run() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cfg = SwabbleConfig()
        try ConfigLoader.save(cfg, at: configURL)
        print("wrote config to \(configURL?.path ?? SwabbleConfig.defaultPath.path)")
    }

    private var configURL: URL? { configPath.map { URL(fileURLWithPath: $0) } }
}
