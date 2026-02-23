/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/OnboardingWidgets.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AppKit
import SwiftUI

struct GlowingOpenClawIcon: View {
    @Environment(\.scenePhase) private var scenePhase

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let size: CGFloat
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let glowIntensity: Double
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let enableFloating: Bool

    @State private var breathe = false

    init(size: CGFloat = 148, glowIntensity: Double = 0.35, enableFloating: Bool = true) {
        self.size = size
        self.glowIntensity = glowIntensity
        self.enableFloating = enableFloating
    }

    var body: some View {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let glowBlurRadius: CGFloat = 18
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let glowCanvasSize: CGFloat = self.size + 56
        ZStack {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [
                            Color.accentColor.opacity(self.glowIntensity),
                            Color.blue.opacity(self.glowIntensity * 0.6),
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing))
                .frame(width: glowCanvasSize, height: glowCanvasSize)
                .padding(glowBlurRadius)
                .blur(radius: glowBlurRadius)
                .scaleEffect(self.breathe ? 1.08 : 0.96)
                .opacity(0.84)

            Image(nsImage: NSApp.applicationIconImage)
                .resizable()
                .frame(width: self.size, height: self.size)
                .clipShape(RoundedRectangle(cornerRadius: self.size * 0.22, style: .continuous))
                .shadow(color: .black.opacity(0.18), radius: 14, y: 6)
                .scaleEffect(self.breathe ? 1.02 : 1.0)
        }
        .frame(
            width: glowCanvasSize + (glowBlurRadius * 2),
            height: glowCanvasSize + (glowBlurRadius * 2))
        .onAppear { self.updateBreatheAnimation() }
        .onDisappear { self.breathe = false }
        .onChange(of: self.scenePhase) { _, _ in
            self.updateBreatheAnimation()
        }
    }

    private func updateBreatheAnimation() {
        guard self.enableFloating, self.scenePhase == .active else {
            self.breathe = false
            return
        }
        guard !self.breathe else { return }
        withAnimation(Animation.easeInOut(duration: 3.6).repeatForever(autoreverses: true)) {
            self.breathe = true
        }
    }
}
