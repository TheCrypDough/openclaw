/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/FileHandleSafeReadTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation
import Testing
@testable import OpenClaw

@Suite struct FileHandleSafeReadTests {
    @Test func readToEndSafelyReturnsEmptyForClosedHandle() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pipe = Pipe()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let handle = pipe.fileHandleForReading
        try? handle.close()

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = handle.readToEndSafely()
        #expect(data.isEmpty)
    }

    @Test func readSafelyUpToCountReturnsEmptyForClosedHandle() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pipe = Pipe()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let handle = pipe.fileHandleForReading
        try? handle.close()

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = handle.readSafely(upToCount: 16)
        #expect(data.isEmpty)
    }

    @Test func readToEndSafelyReadsPipeContents() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pipe = Pipe()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let writeHandle = pipe.fileHandleForWriting
        writeHandle.write(Data("hello".utf8))
        try? writeHandle.close()

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let data = pipe.fileHandleForReading.readToEndSafely()
        #expect(String(data: data, encoding: .utf8) == "hello")
    }

    @Test func readSafelyUpToCountReadsIncrementally() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let pipe = Pipe()
        let writeHandle = pipe.fileHandleForWriting
        writeHandle.write(Data("hello world".utf8))
        try? writeHandle.close()

        let readHandle = pipe.fileHandleForReading
        let first = readHandle.readSafely(upToCount: 5)
        let second = readHandle.readSafely(upToCount: 32)

        #expect(String(data: first, encoding: .utf8) == "hello")
        #expect(String(data: second, encoding: .utf8) == " world")
    }
}
