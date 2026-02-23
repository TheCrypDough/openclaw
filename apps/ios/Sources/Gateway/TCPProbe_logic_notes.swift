/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Gateway/TCPProbe.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Network
import os

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum TCPProbe {
    static func probe(host: String, port: Int, timeoutSeconds: Double, queueLabel: String) async -> Bool {
        guard port >= 1, port <= 65535 else { return false }
        guard let nwPort = NWEndpoint.Port(rawValue: UInt16(port)) else { return false }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let endpointHost = NWEndpoint.Host(host)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let connection = NWConnection(host: endpointHost, port: nwPort, using: .tcp)

        return await withCheckedContinuation { cont in
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let queue = DispatchQueue(label: queueLabel)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let finished = OSAllocatedUnfairLock(initialState: false)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let finish: @Sendable (Bool) -> Void = { ok in
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let shouldResume = finished.withLock { flag -> Bool in
                    if flag { return false }
                    flag = true
                    return true
                }
                guard shouldResume else { return }
                connection.cancel()
                cont.resume(returning: ok)
            }

            connection.stateUpdateHandler = { state in
                switch state {
                case .ready:
                    finish(true)
                case .failed, .cancelled:
                    finish(false)
                default:
                    break
                }
            }

            connection.start(queue: queue)
            queue.asyncAfter(deadline: .now() + timeoutSeconds) { finish(false) }
        }
    }
}

