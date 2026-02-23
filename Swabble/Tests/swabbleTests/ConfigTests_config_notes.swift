# AUTOPLACEHOLDER_ANNOTATION: Swabble/Tests/swabbleTests/ConfigTests.swift
# Purpose: File in Swabble area for project orchestration/configuration/data.
# Area: Swift package subtree for related mobile tooling
# System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
import Foundation
import Testing
@testable import Swabble

@Test
func configRoundTrip() throws {
    var cfg = SwabbleConfig()
    cfg.wake.word = "robot"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let url = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString + ".json")
    defer { try? FileManager.default.removeItem(at: url) }

    try ConfigLoader.save(cfg, at: url)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let loaded = try ConfigLoader.load(at: url)
    #expect(loaded.wake.word == "robot")
    #expect(loaded.hook.prefix.contains("Voice swabble"))
}

@Test
func configMissingThrows() {
    #expect(throws: ConfigError.missingConfig) {
        _ = try ConfigLoader.load(at: FileManager.default.temporaryDirectory.appendingPathComponent("nope.json"))
    }
}
