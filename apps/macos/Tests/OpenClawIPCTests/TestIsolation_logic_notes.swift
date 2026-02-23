/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/TestIsolation.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

actor TestIsolationLock {
    static let shared = TestIsolationLock()

    private var locked = false
    private var waiters: [CheckedContinuation<Void, Never>] = []

    func acquire() async {
        if !self.locked {
            self.locked = true
            return
        }
        await withCheckedContinuation { cont in
            self.waiters.append(cont)
        }
        // `unlock()` resumed us; lock is now held for this caller.
    }

    func release() {
        if self.waiters.isEmpty {
            self.locked = false
            return
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let next = self.waiters.removeFirst()
        next.resume()
    }
}

@MainActor
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
enum TestIsolation {
    static func withIsolatedState<T>(
        env: [String: String?] = [:],
        defaults: [String: Any?] = [:],
        _ body: () async throws -> T) async rethrows -> T
    {
        await TestIsolationLock.shared.acquire()
        var previousEnv: [String: String?] = [:]
        for (key, value) in env {
            previousEnv[key] = getenv(key).map { String(cString: $0) }
            if let value {
                setenv(key, value, 1)
            } else {
                unsetenv(key)
            }
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let userDefaults = UserDefaults.standard
        var previousDefaults: [String: Any?] = [:]
        for (key, value) in defaults {
            previousDefaults[key] = userDefaults.object(forKey: key)
            if let value {
                userDefaults.set(value, forKey: key)
            } else {
                userDefaults.removeObject(forKey: key)
            }
        }

        do {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let result = try await body()
            for (key, value) in previousDefaults {
                if let value {
                    userDefaults.set(value, forKey: key)
                } else {
                    userDefaults.removeObject(forKey: key)
                }
            }
            for (key, value) in previousEnv {
                if let value {
                    setenv(key, value, 1)
                } else {
                    unsetenv(key)
                }
            }
            await TestIsolationLock.shared.release()
            return result
        } catch {
            for (key, value) in previousDefaults {
                if let value {
                    userDefaults.set(value, forKey: key)
                } else {
                    userDefaults.removeObject(forKey: key)
                }
            }
            for (key, value) in previousEnv {
                if let value {
                    setenv(key, value, 1)
                } else {
                    unsetenv(key)
                }
            }
            await TestIsolationLock.shared.release()
            throw error
        }
    }

    static func withEnvValues<T>(
        _ values: [String: String?],
        _ body: () async throws -> T) async rethrows -> T
    {
        try await self.withIsolatedState(env: values, defaults: [:], body)
    }

    static func withUserDefaultsValues<T>(
        _ values: [String: Any?],
        _ body: () async throws -> T) async rethrows -> T
    {
        try await self.withIsolatedState(env: [:], defaults: values, body)
    }

    nonisolated static func tempConfigPath() -> String {
        FileManager().temporaryDirectory
            .appendingPathComponent("openclaw-test-config-\(UUID().uuidString).json")
            .path
    }
}
