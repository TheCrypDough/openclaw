/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/swabble/Commands/ServeCommand.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Commander
import Foundation
import Swabble
import SwabbleKit

@available(macOS 26.0, *)
@MainActor
struct ServeCommand: ParsableCommand {
    @Option(name: .long("config"), help: "Path to config JSON") var configPath: String?
    @Flag(name: .long("no-wake"), help: "Disable wake word") var noWake: Bool = false

    static var commandDescription: CommandDescription {
        CommandDescription(
            commandName: "serve",
            abstract: "Run swabble in the foreground")
    }

    init() {}

    init(parsed: ParsedValues) {
        self.init()
        if parsed.flags.contains("noWake") { noWake = true }
        if let cfg = parsed.options["config"]?.last { configPath = cfg }
    }

    mutating func run() async throws {
        var cfg: SwabbleConfig
        do {
            cfg = try ConfigLoader.load(at: configURL)
        } catch {
            cfg = SwabbleConfig()
            try ConfigLoader.save(cfg, at: configURL)
        }
        if noWake {
            cfg.wake.enabled = false
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let logger = Logger(level: LogLevel(configValue: cfg.logging.level) ?? .info)
        logger.info("swabble serve starting (wake: \(cfg.wake.enabled ? cfg.wake.word : "disabled"))")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pipeline = SpeechPipeline()
        do {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let stream = try await pipeline.start(
                localeIdentifier: cfg.speech.localeIdentifier,
                etiquette: cfg.speech.etiquetteReplacements)
            for await seg in stream {
                if cfg.wake.enabled {
                    guard Self.matchesWake(text: seg.text, cfg: cfg) else { continue }
                }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let stripped = Self.stripWake(text: seg.text, cfg: cfg)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let job = HookJob(text: stripped, timestamp: Date())
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let executor = HookExecutor(config: cfg)
                try await executor.run(job: job)
                if cfg.transcripts.enabled {
                    await TranscriptsStore.shared.append(text: stripped)
                }
                if seg.isFinal {
                    logger.info("final: \(stripped)")
                } else {
                    logger.debug("partial: \(stripped)")
                }
            }
        } catch {
            logger.error("serve error: \(error)")
            throw error
        }
    }

    private var configURL: URL? {
        configPath.map { URL(fileURLWithPath: $0) }
    }

    private static func matchesWake(text: String, cfg: SwabbleConfig) -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let triggers = [cfg.wake.word] + cfg.wake.aliases
        return WakeWordGate.matchesTextOnly(text: text, triggers: triggers)
    }

    private static func stripWake(text: String, cfg: SwabbleConfig) -> String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let triggers = [cfg.wake.word] + cfg.wake.aliases
        return WakeWordGate.stripWake(text: text, triggers: triggers)
    }
}
