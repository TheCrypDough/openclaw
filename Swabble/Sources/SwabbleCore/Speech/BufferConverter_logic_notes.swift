/*
 * AUTO ANNOTATION
 * File: Swabble/Sources/SwabbleCore/Speech/BufferConverter.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
@preconcurrency import AVFoundation
import Foundation

final class BufferConverter {
    private final class Box<T>: @unchecked Sendable { var value: T; init(_ value: T) { self.value = value } }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    enum ConverterError: Swift.Error {
        case failedToCreateConverter
        case failedToCreateConversionBuffer
        case conversionFailed(NSError?)
    }

    private var converter: AVAudioConverter?

    func convert(_ buffer: AVAudioPCMBuffer, to format: AVAudioFormat) throws -> AVAudioPCMBuffer {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let inputFormat = buffer.format
        if inputFormat == format {
            return buffer
        }
        if converter == nil || converter?.outputFormat != format {
            converter = AVAudioConverter(from: inputFormat, to: format)
            converter?.primeMethod = .none
        }
        guard let converter else { throw ConverterError.failedToCreateConverter }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let sampleRateRatio = converter.outputFormat.sampleRate / converter.inputFormat.sampleRate
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let scaledInputFrameLength = Double(buffer.frameLength) * sampleRateRatio
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let frameCapacity = AVAudioFrameCount(scaledInputFrameLength.rounded(.up))
        guard let conversionBuffer = AVAudioPCMBuffer(pcmFormat: converter.outputFormat, frameCapacity: frameCapacity)
        else {
            throw ConverterError.failedToCreateConversionBuffer
        }

        var nsError: NSError?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let consumed = Box(false)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let inputBuffer = buffer
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status = converter.convert(to: conversionBuffer, error: &nsError) { _, statusPtr in
            if consumed.value {
                statusPtr.pointee = .noDataNow
                return nil
            }
            consumed.value = true
            statusPtr.pointee = .haveData
            return inputBuffer
        }
        if status == .error {
            throw ConverterError.conversionFailed(nsError)
        }
        return conversionBuffer
    }
}
