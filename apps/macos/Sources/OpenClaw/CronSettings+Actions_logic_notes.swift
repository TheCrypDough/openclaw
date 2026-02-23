/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/CronSettings+Actions.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import OpenClawProtocol

extension CronSettings {
    func save(payload: [String: AnyCodable]) async {
        guard !self.isSaving else { return }
        self.isSaving = true
        self.editorError = nil
        do {
            try await self.store.upsertJob(id: self.editingJob?.id, payload: payload)
            await MainActor.run {
                self.isSaving = false
                self.showEditor = false
                self.editingJob = nil
            }
        } catch {
            await MainActor.run {
                self.isSaving = false
                self.editorError = error.localizedDescription
            }
        }
    }
}
