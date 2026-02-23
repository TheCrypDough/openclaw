/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/MicLevelMonitor.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import AVFoundation
import OSLog
import SwiftUI

actor MicLevelMonitor {
    private let logger = Logger(subsystem: "ai.openclaw", category: "voicewake.meter")
    private var engine: AVAudioEngine?
    private var update: (@Sendable (Double) -> Void)?
    private var running = false
    private var smoothedLevel: Double = 0

    func start(onLevel: @Sendable @escaping (Double) -> Void) async throws {
        self.update = onLevel
        if self.running { return }
        self.logger.info(
            "mic level monitor start (\(AudioInputDeviceObserver.defaultInputDeviceSummary(), privacy: .public))")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let engine = AVAudioEngine()
        self.engine = engine
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let input = engine.inputNode
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let format = input.outputFormat(forBus: 0)
        guard format.channelCount > 0, format.sampleRate > 0 else {
            self.engine = nil
            throw NSError(
                domain: "MicLevelMonitor",
                code: 1,
                userInfo: [NSLocalizedDescriptionKey: "No audio input available"])
        }
        input.removeTap(onBus: 0)
        input.installTap(onBus: 0, bufferSize: 512, format: format) { [weak self] buffer, _ in
            guard let self else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let level = Self.normalizedLevel(from: buffer)
            Task { await self.push(level: level) }
        }
        engine.prepare()
        try engine.start()
        self.running = true
    }

    func stop() {
        guard self.running else { return }
        if let engine {
            engine.inputNode.removeTap(onBus: 0)
            engine.stop()
        }
        self.engine = nil
        self.running = false
    }

    private func push(level: Double) {
        self.smoothedLevel = (self.smoothedLevel * 0.45) + (level * 0.55)
        guard let update else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let value = self.smoothedLevel
        Task { @MainActor in update(value) }
    }

    private static func normalizedLevel(from buffer: AVAudioPCMBuffer) -> Double {
        guard let channel = buffer.floatChannelData?[0] else { return 0 }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frameCount = Int(buffer.frameLength)
        guard frameCount > 0 else { return 0 }
        var sum: Float = 0
        for i in 0..<frameCount {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let s = channel[i]
            sum += s * s
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let rms = sqrt(sum / Float(frameCount) + 1e-12)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let db = 20 * log10(Double(rms))
        return max(0, min(1, (db + 50) / 50))
    }
}

struct MicLevelBar: View {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let level: Double
    let segments: Int = 12

    var body: some View {
        HStack(spacing: 3) {
            ForEach(0..<self.segments, id: \.self) { idx in
                let fill = self.level * Double(self.segments) > Double(idx)
                RoundedRectangle(cornerRadius: 2)
                    .fill(fill ? self.segmentColor(for: idx) : Color.gray.opacity(0.35))
                    .frame(width: 14, height: 10)
            }
        }
        .padding(4)
        .background(
            RoundedRectangle(cornerRadius: 6)
                .stroke(Color.gray.opacity(0.25), lineWidth: 1))
    }

    private func segmentColor(for idx: Int) -> Color {
        let fraction = Double(idx + 1) / Double(self.segments)
        if fraction < 0.65 { return .green }
        if fraction < 0.85 { return .yellow }
        return .red
    }
}
