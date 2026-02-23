/*
 * AUTO ANNOTATION
 * File: apps/shared/OpenClawKit/Sources/OpenClawKit/AudioStreamingProtocols.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

@MainActor
public protocol StreamingAudioPlaying {
    func play(stream: AsyncThrowingStream<Data, Error>) async -> StreamingPlaybackResult
    func stop() -> Double?
}

@MainActor
public protocol PCMStreamingAudioPlaying {
    func play(stream: AsyncThrowingStream<Data, Error>, sampleRate: Double) async -> StreamingPlaybackResult
    func stop() -> Double?
}

extension StreamingAudioPlayer: StreamingAudioPlaying {}
extension PCMStreamingAudioPlayer: PCMStreamingAudioPlaying {}
