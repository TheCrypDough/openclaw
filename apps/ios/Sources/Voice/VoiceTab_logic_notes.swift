/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Voice/VoiceTab.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

struct VoiceTab: View {
    @Environment(NodeAppModel.self) private var appModel
    @Environment(VoiceWakeManager.self) private var voiceWake
    @AppStorage("voiceWake.enabled") private var voiceWakeEnabled: Bool = false
    @AppStorage("talk.enabled") private var talkEnabled: Bool = false

    var body: some View {
        NavigationStack {
            List {
                Section("Status") {
                    LabeledContent("Voice Wake", value: self.voiceWakeEnabled ? "Enabled" : "Disabled")
                    LabeledContent("Listener", value: self.voiceWake.isListening ? "Listening" : "Idle")
                    Text(self.voiceWake.statusText)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                    LabeledContent("Talk Mode", value: self.talkEnabled ? "Enabled" : "Disabled")
                }

                Section("Notes") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                    let triggers = self.voiceWake.activeTriggerWords
                    Group {
                        if triggers.isEmpty {
                            Text("Add wake words in Settings.")
                        } else if triggers.count == 1 {
                            Text("Say “\(triggers[0]) …” to trigger.")
                        } else if triggers.count == 2 {
                            Text("Say “\(triggers[0]) …” or “\(triggers[1]) …” to trigger.")
                        } else {
                            Text("Say “\(triggers.joined(separator: " …”, “")) …” to trigger.")
                        }
                    }
                    .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Voice")
            .onChange(of: self.voiceWakeEnabled) { _, newValue in
                self.appModel.setVoiceWakeEnabled(newValue)
            }
            .onChange(of: self.talkEnabled) { _, newValue in
                self.appModel.setTalkEnabled(newValue)
            }
        }
    }
}
