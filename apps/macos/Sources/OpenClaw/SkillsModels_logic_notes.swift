/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/SkillsModels.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OpenClawProtocol

struct SkillsStatusReport: Codable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let workspaceDir: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let managedSkillsDir: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let skills: [SkillStatus]
}

struct SkillStatus: Codable, Identifiable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let name: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let description: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let source: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let filePath: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let baseDir: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let skillKey: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let primaryEnv: String?
    let emoji: String?
    let homepage: String?
    let always: Bool
    let disabled: Bool
    let eligible: Bool
    let requirements: SkillRequirements
    let missing: SkillMissing
    let configChecks: [SkillStatusConfigCheck]
    let install: [SkillInstallOption]

    var id: String {
        self.name
    }
}

struct SkillRequirements: Codable {
    let bins: [String]
    let env: [String]
    let config: [String]
}

struct SkillMissing: Codable {
    let bins: [String]
    let env: [String]
    let config: [String]
}

struct SkillStatusConfigCheck: Codable, Identifiable {
    let path: String
    let value: AnyCodable?
    let satisfied: Bool

    var id: String {
        self.path
    }
}

struct SkillInstallOption: Codable, Identifiable {
    let id: String
    let kind: String
    let label: String
    let bins: [String]
}

struct SkillInstallResult: Codable {
    let ok: Bool
    let message: String
    let stdout: String?
    let stderr: String?
    let code: Int?
}

struct SkillUpdateResult: Codable {
    let ok: Bool
    let skillKey: String
    let config: [String: AnyCodable]?
}
