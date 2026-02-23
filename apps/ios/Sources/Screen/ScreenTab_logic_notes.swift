/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Screen/ScreenTab.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawKit
import SwiftUI

struct ScreenTab: View {
    @Environment(NodeAppModel.self) private var appModel

    var body: some View {
        ZStack(alignment: .top) {
            ScreenWebView(controller: self.appModel.screen)
                .ignoresSafeArea()
                .overlay(alignment: .top) {
                    if let errorText = self.appModel.screen.errorText,
                       self.appModel.gatewayServerName == nil
                    {
                        Text(errorText)
                            .font(.footnote)
                            .padding(10)
                            .background(.thinMaterial)
                            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                            .padding()
                    }
                }
        }
    }

    // Navigation is agent-driven; no local URL bar here.
}
