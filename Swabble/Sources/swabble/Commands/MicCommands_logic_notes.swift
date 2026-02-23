/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/swabble/Commands/MicCommands.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AVFoundation
import Commander
import Foundation
import Swabble

@MainActor
struct MicCommand: ParsableCommand {
    static var commandDescription: CommandDescription {
        CommandDescription(
            commandName: "mic",
            abstract: "Microphone management",
            subcommands: [MicList.self, MicSet.self])
    }
}

@MainActor
struct MicList: ParsableCommand {
    static var commandDescription: CommandDescription {
        CommandDescription(commandName: "list", abstract: "List input devices")
    }

    init() {}
    init(parsed: ParsedValues) {}

    mutating func run() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let session = AVCaptureDevice.DiscoverySession(
            deviceTypes: [.microphone, .external],
            mediaType: .audio,
            position: .unspecified)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let devices = session.devices
        if devices.isEmpty { print("no audio inputs found"); return }
        for (idx, device) in devices.enumerated() {
            print("[\(idx)] \(device.localizedName)")
        }
    }
}

@MainActor
struct MicSet: ParsableCommand {
    @Argument(help: "Device index from list") var index: Int = 0
    @Option(name: .long("config"), help: "Path to config JSON") var configPath: String?

    static var commandDescription: CommandDescription {
        CommandDescription(commandName: "set", abstract: "Set default input device index")
    }

    init() {}
    init(parsed: ParsedValues) {
        self.init()
        if let value = parsed.positional.first, let intVal = Int(value) { index = intVal }
        if let cfg = parsed.options["config"]?.last { configPath = cfg }
    }

    mutating func run() async throws {
        var cfg = try ConfigLoader.load(at: configURL)
        cfg.audio.deviceIndex = index
        try ConfigLoader.save(cfg, at: configURL)
        print("saved device index \(index)")
    }

    private var configURL: URL? { configPath.map { URL(fileURLWithPath: $0) } }
}
