/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/ChannelsSettings.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import SwiftUI

struct ChannelsSettings: View {
    struct ChannelItem: Identifiable, Hashable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let id: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let title: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let detailTitle: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let systemImage: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sortOrder: Int
    }

    @Bindable var store: ChannelsStore
    @State var selectedChannel: ChannelItem?

    init(store: ChannelsStore = .shared) {
        self.store = store
    }
}
