/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/swabble/CLI/CLIRegistry.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Commander
import Foundation

@available(macOS 26.0, *)
@MainActor
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum CLIRegistry {
    static var descriptors: [CommandDescriptor] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let serveDesc = descriptor(for: ServeCommand.self)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let transcribeDesc = descriptor(for: TranscribeCommand.self)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let testHookDesc = descriptor(for: TestHookCommand.self)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let micList = descriptor(for: MicList.self)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let micSet = descriptor(for: MicSet.self)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let micRoot = CommandDescriptor(
            name: "mic",
            abstract: "Microphone management",
            discussion: nil,
            signature: CommandSignature(),
            subcommands: [micList, micSet])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let serviceRoot = CommandDescriptor(
            name: "service",
            abstract: "launchd helper",
            discussion: nil,
            signature: CommandSignature(),
            subcommands: [
                descriptor(for: ServiceInstall.self),
                descriptor(for: ServiceUninstall.self),
                descriptor(for: ServiceStatus.self)
            ])
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let doctorDesc = descriptor(for: DoctorCommand.self)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let setupDesc = descriptor(for: SetupCommand.self)
        let healthDesc = descriptor(for: HealthCommand.self)
        let tailLogDesc = descriptor(for: TailLogCommand.self)
        let startDesc = descriptor(for: StartCommand.self)
        let stopDesc = descriptor(for: StopCommand.self)
        let restartDesc = descriptor(for: RestartCommand.self)
        let statusDesc = descriptor(for: StatusCommand.self)

        let rootSignature = CommandSignature().withStandardRuntimeFlags()
        let root = CommandDescriptor(
            name: "swabble",
            abstract: "Speech hook daemon",
            discussion: "Local wake-word → SpeechTranscriber → hook",
            signature: rootSignature,
            subcommands: [
                serveDesc,
                transcribeDesc,
                testHookDesc,
                micRoot,
                serviceRoot,
                doctorDesc,
                setupDesc,
                healthDesc,
                tailLogDesc,
                startDesc,
                stopDesc,
                restartDesc,
                statusDesc
            ])
        return [root]
    }

    private static func descriptor(for type: any ParsableCommand.Type) -> CommandDescriptor {
        let sig = CommandSignature.describe(type.init()).withStandardRuntimeFlags()
        return CommandDescriptor(
            name: type.commandDescription.commandName ?? "",
            abstract: type.commandDescription.abstract,
            discussion: type.commandDescription.discussion,
            signature: sig,
            subcommands: [])
    }
}
