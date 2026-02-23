/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/RemotePortTunnelTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
@testable import OpenClaw

#if canImport(Darwin)
import Darwin
import Foundation

@Suite struct RemotePortTunnelTests {
    @Test func drainStderrDoesNotCrashWhenHandleClosed() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pipe = Pipe()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let handle = pipe.fileHandleForReading
        try? handle.close()

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let drained = RemotePortTunnel._testDrainStderr(handle)
        #expect(drained.isEmpty)
    }

    @Test func portIsFreeDetectsIPv4Listener() {
        var fd = socket(AF_INET, SOCK_STREAM, 0)
        #expect(fd >= 0)
        guard fd >= 0 else { return }
        defer {
            if fd >= 0 { _ = Darwin.close(fd) }
        }

        var one: Int32 = 1
        _ = setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &one, socklen_t(MemoryLayout.size(ofValue: one)))

        var addr = sockaddr_in()
        addr.sin_len = UInt8(MemoryLayout<sockaddr_in>.size)
        addr.sin_family = sa_family_t(AF_INET)
        addr.sin_port = 0
        addr.sin_addr = in_addr(s_addr: inet_addr("127.0.0.1"))

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let bound = withUnsafePointer(to: &addr) { ptr in
            ptr.withMemoryRebound(to: sockaddr.self, capacity: 1) { sa in
                Darwin.bind(fd, sa, socklen_t(MemoryLayout<sockaddr_in>.size))
            }
        }
        #expect(bound == 0)
        guard bound == 0 else { return }
        #expect(Darwin.listen(fd, 1) == 0)

        var name = sockaddr_in()
        var nameLen = socklen_t(MemoryLayout<sockaddr_in>.size)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let got = withUnsafeMutablePointer(to: &name) { ptr in
            ptr.withMemoryRebound(to: sockaddr.self, capacity: 1) { sa in
                getsockname(fd, sa, &nameLen)
            }
        }
        #expect(got == 0)
        guard got == 0 else { return }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let port = UInt16(bigEndian: name.sin_port)
        #expect(RemotePortTunnel._testPortIsFree(port) == false)

        _ = Darwin.close(fd)
        fd = -1

        // In parallel test runs, another test may briefly grab the same ephemeral port.
        // Poll for a short window to avoid flakiness.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let deadline = Date().addingTimeInterval(0.5)
        var free = false
        while Date() < deadline {
            if RemotePortTunnel._testPortIsFree(port) {
                free = true
                break
            }
            usleep(10000) // 10ms
        }
        #expect(free == true)
    }
}
#endif
