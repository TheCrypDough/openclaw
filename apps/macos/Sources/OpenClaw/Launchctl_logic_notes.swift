/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/Launchctl.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum Launchctl {
    struct Result: Sendable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let status: Int32
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let output: String
    }

    @discardableResult
    static func run(_ args: [String]) async -> Result {
        await Task.detached(priority: .utility) { () -> Result in
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let process = Process()
            process.launchPath = "/bin/launchctl"
            process.arguments = args
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let pipe = Pipe()
            process.standardOutput = pipe
            process.standardError = pipe
            do {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let data = try process.runAndReadToEnd(from: pipe)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let output = String(data: data, encoding: .utf8) ?? ""
                return Result(status: process.terminationStatus, output: output)
            } catch {
                return Result(status: -1, output: error.localizedDescription)
            }
        }.value
    }
}

struct LaunchAgentPlistSnapshot: Equatable, Sendable {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let programArguments: [String]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let environment: [String: String]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let stdoutPath: String?
    let stderrPath: String?

    let port: Int?
    let bind: String?
    let token: String?
    let password: String?
}

enum LaunchAgentPlist {
    static func snapshot(url: URL) -> LaunchAgentPlistSnapshot? {
        guard let data = try? Data(contentsOf: url) else { return nil }
        let rootAny: Any
        do {
            rootAny = try PropertyListSerialization.propertyList(
                from: data,
                options: [],
                format: nil)
        } catch {
            return nil
        }
        guard let root = rootAny as? [String: Any] else { return nil }
        let programArguments = root["ProgramArguments"] as? [String] ?? []
        let env = root["EnvironmentVariables"] as? [String: String] ?? [:]
        let stdoutPath = (root["StandardOutPath"] as? String)?
            .trimmingCharacters(in: .whitespacesAndNewlines).nonEmpty
        let stderrPath = (root["StandardErrorPath"] as? String)?
            .trimmingCharacters(in: .whitespacesAndNewlines).nonEmpty
        let port = Self.extractFlagInt(programArguments, flag: "--port")
        let bind = Self.extractFlagString(programArguments, flag: "--bind")?.lowercased()
        let token = env["OPENCLAW_GATEWAY_TOKEN"]?.trimmingCharacters(in: .whitespacesAndNewlines).nonEmpty
        let password = env["OPENCLAW_GATEWAY_PASSWORD"]?.trimmingCharacters(in: .whitespacesAndNewlines).nonEmpty
        return LaunchAgentPlistSnapshot(
            programArguments: programArguments,
            environment: env,
            stdoutPath: stdoutPath,
            stderrPath: stderrPath,
            port: port,
            bind: bind,
            token: token,
            password: password)
    }

    private static func extractFlagInt(_ args: [String], flag: String) -> Int? {
        guard let raw = self.extractFlagString(args, flag: flag) else { return nil }
        return Int(raw)
    }

    private static func extractFlagString(_ args: [String], flag: String) -> String? {
        guard let idx = args.firstIndex(of: flag) else { return nil }
        let valueIdx = args.index(after: idx)
        guard valueIdx < args.endIndex else { return nil }
        let token = args[valueIdx].trimmingCharacters(in: .whitespacesAndNewlines)
        return token.isEmpty ? nil : token
    }
}
