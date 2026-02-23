/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/ModelCatalogLoaderTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite
struct ModelCatalogLoaderTests {
    @Test
    func loadParsesModelsFromTypeScriptAndSorts() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let src = """
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        export const MODELS = {
          openai: {
            "gpt-4o-mini": { name: "GPT-4o mini", contextWindow: 128000 } satisfies any,
            "gpt-4o": { name: "GPT-4o", contextWindow: 128000 } as any,
            "gpt-3.5": { contextWindow: 16000 },
          },
          anthropic: {
            "claude-3": { name: "Claude 3", contextWindow: 200000 },
          },
        };
        """

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let tmp = FileManager().temporaryDirectory
            .appendingPathComponent("models-\(UUID().uuidString).ts")
        defer { try? FileManager().removeItem(at: tmp) }
        try src.write(to: tmp, atomically: true, encoding: .utf8)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let choices = try await ModelCatalogLoader.load(from: tmp.path)
        #expect(choices.count == 4)
        #expect(choices.first?.provider == "anthropic")
        #expect(choices.first?.id == "claude-3")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let ids = Set(choices.map(\.id))
        #expect(ids == Set(["claude-3", "gpt-4o", "gpt-4o-mini", "gpt-3.5"]))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let openai = choices.filter { $0.provider == "openai" }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let openaiNames = openai.map(\.name)
        #expect(openaiNames == openaiNames.sorted { a, b in
            a.localizedCaseInsensitiveCompare(b) == .orderedAscending
        })
    }

    @Test
    func loadWithNoExportReturnsEmptyChoices() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let src = "const NOPE = 1;"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let tmp = FileManager().temporaryDirectory
            .appendingPathComponent("models-\(UUID().uuidString).ts")
        defer { try? FileManager().removeItem(at: tmp) }
        try src.write(to: tmp, atomically: true, encoding: .utf8)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let choices = try await ModelCatalogLoader.load(from: tmp.path)
        #expect(choices.isEmpty)
    }
}
