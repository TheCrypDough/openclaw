/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClawDiscovery/TailscaleNetwork.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Darwin
import Foundation

public enum TailscaleNetwork {
    public static func isTailnetIPv4(_ address: String) -> Bool {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parts = address.split(separator: ".")
        guard parts.count == 4 else { return false }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let octets = parts.compactMap { Int($0) }
        guard octets.count == 4 else { return false }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let a = octets[0]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let b = octets[1]
        return a == 100 && b >= 64 && b <= 127
    }

    public static func detectTailnetIPv4() -> String? {
        var addrList: UnsafeMutablePointer<ifaddrs>?
        guard getifaddrs(&addrList) == 0, let first = addrList else { return nil }
        defer { freeifaddrs(addrList) }

        for ptr in sequence(first: first, next: { $0.pointee.ifa_next }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let flags = Int32(ptr.pointee.ifa_flags)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let isUp = (flags & IFF_UP) != 0
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let isLoopback = (flags & IFF_LOOPBACK) != 0
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let family = ptr.pointee.ifa_addr.pointee.sa_family
            if !isUp || isLoopback || family != UInt8(AF_INET) { continue }

            var addr = ptr.pointee.ifa_addr.pointee
            var buffer = [CChar](repeating: 0, count: Int(NI_MAXHOST))
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let result = getnameinfo(
                &addr,
                socklen_t(ptr.pointee.ifa_addr.pointee.sa_len),
                &buffer,
                socklen_t(buffer.count),
                nil,
                0,
                NI_NUMERICHOST)
            guard result == 0 else { continue }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let len = buffer.prefix { $0 != 0 }
            let bytes = len.map { UInt8(bitPattern: $0) }
            guard let ip = String(bytes: bytes, encoding: .utf8) else { continue }
            if self.isTailnetIPv4(ip) { return ip }
        }

        return nil
    }
}
