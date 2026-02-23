/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawChatUI/ChatSheets.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Observation
import SwiftUI

@MainActor
struct ChatSessionsSheet: View {
    @Bindable var viewModel: OpenClawChatViewModel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List(self.viewModel.sessions) { session in
                Button {
                    self.viewModel.switchSession(to: session.key)
                    self.dismiss()
                } label: {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(session.displayName ?? session.key)
                            .font(.system(.body, design: .monospaced))
                            .lineLimit(1)
                        if let updatedAt = session.updatedAt, updatedAt > 0 {
                            Text(Date(timeIntervalSince1970: updatedAt / 1000).formatted(
                                date: .abbreviated,
                                time: .shortened))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("Sessions")
            .toolbar {
                #if os(macOS)
                ToolbarItem(placement: .automatic) {
                    Button {
                        self.viewModel.refreshSessions(limit: 200)
                    } label: {
                        Image(systemName: "arrow.clockwise")
                    }
                }
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        self.dismiss()
                    } label: {
                        Image(systemName: "xmark")
                    }
                }
                #else
                ToolbarItem(placement: .topBarLeading) {
                    Button {
                        self.viewModel.refreshSessions(limit: 200)
                    } label: {
                        Image(systemName: "arrow.clockwise")
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        self.dismiss()
                    } label: {
                        Image(systemName: "xmark")
                    }
                }
                #endif
            }
            .onAppear {
                self.viewModel.refreshSessions(limit: 200)
            }
        }
    }
}
