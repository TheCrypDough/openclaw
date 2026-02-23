/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/CronSettings.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Observation
import SwiftUI

struct CronSettings: View {
    @Bindable var store: CronJobsStore
    @Bindable var channelsStore: ChannelsStore
    @State var showEditor = false
    @State var editingJob: CronJob?
    @State var editorError: String?
    @State var isSaving = false
    @State var confirmDelete: CronJob?

    init(store: CronJobsStore = .shared, channelsStore: ChannelsStore = .shared) {
        self.store = store
        self.channelsStore = channelsStore
    }
}
