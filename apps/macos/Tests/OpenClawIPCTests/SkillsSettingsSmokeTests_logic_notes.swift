/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/SkillsSettingsSmokeTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawProtocol
import Testing
@testable import OpenClaw

@Suite(.serialized)
@MainActor
struct SkillsSettingsSmokeTests {
    @Test func skillsSettingsBuildsBodyWithSkillsRemote() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let model = SkillsSettingsModel()
        model.statusMessage = "Loaded"
        model.skills = [
            SkillStatus(
                name: "Needs Setup",
                description: "Missing bins and env",
                source: "openclaw-managed",
                filePath: "/tmp/skills/needs-setup",
                baseDir: "/tmp/skills",
                skillKey: "needs-setup",
                primaryEnv: "API_KEY",
                emoji: "🧰",
                homepage: "https://example.com/needs-setup",
                always: false,
                disabled: false,
                eligible: false,
                requirements: SkillRequirements(
                    bins: ["python3"],
                    env: ["API_KEY"],
                    config: ["skills.needs-setup"]),
                missing: SkillMissing(
                    bins: ["python3"],
                    env: ["API_KEY"],
                    config: ["skills.needs-setup"]),
                configChecks: [
                    SkillStatusConfigCheck(path: "skills.needs-setup", value: AnyCodable(false), satisfied: false),
                ],
                install: [
                    SkillInstallOption(id: "brew", kind: "brew", label: "brew install python", bins: ["python3"]),
                ]),
            SkillStatus(
                name: "Ready Skill",
                description: "All set",
                source: "openclaw-bundled",
                filePath: "/tmp/skills/ready",
                baseDir: "/tmp/skills",
                skillKey: "ready",
                primaryEnv: nil,
                emoji: "✅",
                homepage: "https://example.com/ready",
                always: false,
                disabled: false,
                eligible: true,
                requirements: SkillRequirements(bins: [], env: [], config: []),
                missing: SkillMissing(bins: [], env: [], config: []),
                configChecks: [
                    SkillStatusConfigCheck(path: "skills.ready", value: AnyCodable(true), satisfied: true),
                    SkillStatusConfigCheck(path: "skills.limit", value: AnyCodable(5), satisfied: true),
                ],
                install: []),
            SkillStatus(
                name: "Disabled Skill",
                description: "Disabled in config",
                source: "openclaw-extra",
                filePath: "/tmp/skills/disabled",
                baseDir: "/tmp/skills",
                skillKey: "disabled",
                primaryEnv: nil,
                emoji: "🚫",
                homepage: nil,
                always: false,
                disabled: true,
                eligible: false,
                requirements: SkillRequirements(bins: [], env: [], config: []),
                missing: SkillMissing(bins: [], env: [], config: []),
                configChecks: [],
                install: []),
        ]

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state = AppState(preview: true)
        state.connectionMode = .remote
        var view = SkillsSettings(state: state, model: model)
        view.setFilterForTesting("all")
        _ = view.body
        view.setFilterForTesting("needsSetup")
        _ = view.body
    }

    @Test func skillsSettingsBuildsBodyWithLocalMode() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let model = SkillsSettingsModel()
        model.skills = [
            SkillStatus(
                name: "Local Skill",
                description: "Local ready",
                source: "openclaw-workspace",
                filePath: "/tmp/skills/local",
                baseDir: "/tmp/skills",
                skillKey: "local",
                primaryEnv: nil,
                emoji: "🏠",
                homepage: nil,
                always: false,
                disabled: false,
                eligible: true,
                requirements: SkillRequirements(bins: [], env: [], config: []),
                missing: SkillMissing(bins: [], env: [], config: []),
                configChecks: [],
                install: []),
        ]

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let state = AppState(preview: true)
        state.connectionMode = .local
        var view = SkillsSettings(state: state, model: model)
        view.setFilterForTesting("ready")
        _ = view.body
    }

    @Test func skillsSettingsExercisesPrivateViews() {
        SkillsSettings.exerciseForTesting()
    }
}
