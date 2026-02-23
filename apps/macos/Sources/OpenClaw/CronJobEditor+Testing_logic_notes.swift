/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/CronJobEditor+Testing.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#if DEBUG
extension CronJobEditor {
    mutating func exerciseForTesting() {
        self.name = "Test job"
        self.description = "Test description"
        self.agentId = "ops"
        self.enabled = true
        self.sessionTarget = .isolated
        self.wakeMode = .now

        self.scheduleKind = .every
        self.everyText = "15m"

        self.payloadKind = .agentTurn
        self.agentMessage = "Run diagnostic"
        self.deliveryMode = .announce
        self.channel = "last"
        self.to = "+15551230000"
        self.thinking = "low"
        self.timeoutSeconds = "90"
        self.bestEffortDeliver = true

        _ = self.buildAgentTurnPayload()
        _ = try? self.buildPayload()
        _ = self.formatDuration(ms: 45000)
    }
}
#endif
