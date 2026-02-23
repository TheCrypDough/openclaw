/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/ExecApprovalEvaluation.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

struct ExecApprovalEvaluation {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let command: [String]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let displayCommand: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let agentId: String?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let security: ExecSecurity
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let ask: ExecAsk
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let env: [String: String]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let resolution: ExecCommandResolution?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let allowlistResolutions: [ExecCommandResolution]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let allowlistMatches: [ExecAllowlistEntry]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let allowlistSatisfied: Bool
    let allowlistMatch: ExecAllowlistEntry?
    let skillAllow: Bool
}

enum ExecApprovalEvaluator {
    static func evaluate(
        command: [String],
        rawCommand: String?,
        cwd: String?,
        envOverrides: [String: String]?,
        agentId: String?) async -> ExecApprovalEvaluation
    {
        let trimmedAgent = agentId?.trimmingCharacters(in: .whitespacesAndNewlines)
        let normalizedAgentId = (trimmedAgent?.isEmpty == false) ? trimmedAgent : nil
        let approvals = ExecApprovalsStore.resolve(agentId: normalizedAgentId)
        let security = approvals.agent.security
        let ask = approvals.agent.ask
        let env = HostEnvSanitizer.sanitize(overrides: envOverrides)
        let displayCommand = ExecCommandFormatter.displayString(for: command, rawCommand: rawCommand)
        let allowlistResolutions = ExecCommandResolution.resolveForAllowlist(
            command: command,
            rawCommand: rawCommand,
            cwd: cwd,
            env: env)
        let allowlistMatches = security == .allowlist
            ? ExecAllowlistMatcher.matchAll(entries: approvals.allowlist, resolutions: allowlistResolutions)
            : []
        let allowlistSatisfied = security == .allowlist &&
            !allowlistResolutions.isEmpty &&
            allowlistMatches.count == allowlistResolutions.count

        let skillAllow: Bool
        if approvals.agent.autoAllowSkills, !allowlistResolutions.isEmpty {
            let bins = await SkillBinsCache.shared.currentBins()
            skillAllow = allowlistResolutions.allSatisfy { bins.contains($0.executableName) }
        } else {
            skillAllow = false
        }

        return ExecApprovalEvaluation(
            command: command,
            displayCommand: displayCommand,
            agentId: normalizedAgentId,
            security: security,
            ask: ask,
            env: env,
            resolution: allowlistResolutions.first,
            allowlistResolutions: allowlistResolutions,
            allowlistMatches: allowlistMatches,
            allowlistSatisfied: allowlistSatisfied,
            allowlistMatch: allowlistSatisfied ? allowlistMatches.first : nil,
            skillAllow: skillAllow)
    }
}
