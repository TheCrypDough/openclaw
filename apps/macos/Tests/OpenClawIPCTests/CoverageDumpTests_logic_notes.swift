/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/CoverageDumpTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Darwin
import Foundation
import Testing

@Suite(.serialized)
struct CoverageDumpTests {
    @Test func periodicallyFlushCoverage() async {
        guard ProcessInfo.processInfo.environment["LLVM_PROFILE_FILE"] != nil else { return }
        guard let writeProfile = resolveProfileWriteFile() else { return }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let deadline = Date().addingTimeInterval(4)
        while Date() < deadline {
            _ = writeProfile()
            try? await Task.sleep(nanoseconds: 250_000_000)
        }
    }
}

private typealias ProfileWriteFn = @convention(c) () -> Int32

private func resolveProfileWriteFile() -> ProfileWriteFn? {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let symbol = dlsym(UnsafeMutableRawPointer(bitPattern: -2), "__llvm_profile_write_file")
    guard let symbol else { return nil }
    return unsafeBitCast(symbol, to: ProfileWriteFn.self)
}
