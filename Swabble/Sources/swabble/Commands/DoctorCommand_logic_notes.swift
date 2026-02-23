/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/swabble/Commands/DoctorCommand.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Commander
import Foundation
import Speech
import Swabble

@MainActor
struct DoctorCommand: ParsableCommand {
    static var commandDescription: CommandDescription {
        CommandDescription(commandName: "doctor", abstract: "Check Speech permission and config")
    }

    @Option(name: .long("config"), help: "Path to config JSON") var configPath: String?

    init() {}
    init(parsed: ParsedValues) {
        self.init()
        if let cfg = parsed.options["config"]?.last { configPath = cfg }
    }

    mutating func run() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let auth = await SFSpeechRecognizer.authorizationStatus()
        print("Speech auth: \(auth)")
        do {
            _ = try ConfigLoader.load(at: configURL)
            print("Config: OK")
        } catch {
            print("Config missing or invalid; run setup")
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let session = AVCaptureDevice.DiscoverySession(
            deviceTypes: [.microphone, .external],
            mediaType: .audio,
            position: .unspecified)
        print("Mics found: \(session.devices.count)")
    }

    private var configURL: URL? { configPath.map { URL(fileURLWithPath: $0) } }
}
