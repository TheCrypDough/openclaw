/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/swabble/Commands/TestHookCommand.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Commander
import Foundation
import Swabble

@MainActor
struct TestHookCommand: ParsableCommand {
    @Argument(help: "Text to send to hook") var text: String
    @Option(name: .long("config"), help: "Path to config JSON") var configPath: String?

    static var commandDescription: CommandDescription {
        CommandDescription(commandName: "test-hook", abstract: "Invoke the configured hook with text")
    }

    init() {}

    init(parsed: ParsedValues) {
        self.init()
        if let positional = parsed.positional.first { text = positional }
        if let cfg = parsed.options["config"]?.last { configPath = cfg }
    }

    mutating func run() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let cfg = try ConfigLoader.load(at: configURL)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let executor = HookExecutor(config: cfg)
        try await executor.run(job: HookJob(text: text, timestamp: Date()))
        print("hook invoked")
    }

    private var configURL: URL? { configPath.map { URL(fileURLWithPath: $0) } }
}
