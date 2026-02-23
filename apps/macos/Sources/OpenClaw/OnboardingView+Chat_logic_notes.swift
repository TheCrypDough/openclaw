/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/OnboardingView+Chat.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

extension OnboardingView {
    func maybeKickoffOnboardingChat(for pageIndex: Int) {
        guard pageIndex == self.onboardingChatPageIndex else { return }
        guard self.showOnboardingChat else { return }
        guard !self.didAutoKickoff else { return }
        self.didAutoKickoff = true

        Task { @MainActor in
            for _ in 0..<20 {
                if !self.onboardingChatModel.isLoading { break }
                try? await Task.sleep(nanoseconds: 200_000_000)
            }
            guard self.onboardingChatModel.messages.isEmpty else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let kickoff =
                "Hi! I just installed OpenClaw and you’re my brand‑new agent. " +
                "Please start the first‑run ritual from BOOTSTRAP.md, ask one question at a time, " +
                "and before we talk about WhatsApp/Telegram, visit soul.md with me to craft SOUL.md: " +
                "ask what matters to me and how you should be. Then guide me through choosing " +
                "how we should talk (web‑only, WhatsApp, or Telegram)."
            self.onboardingChatModel.input = kickoff
            self.onboardingChatModel.send()
        }
    }
}
