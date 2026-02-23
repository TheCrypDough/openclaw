/*
 * AUTO ANNOTATION
 * File: apps/macos/Package.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
// swift-tools-version: 6.2
// Package manifest for the OpenClaw macOS companion (menu bar app + IPC library).

import PackageDescription

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let package = Package(
    name: "OpenClaw",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "OpenClawIPC", targets: ["OpenClawIPC"]),
        .library(name: "OpenClawDiscovery", targets: ["OpenClawDiscovery"]),
        .executable(name: "OpenClaw", targets: ["OpenClaw"]),
        .executable(name: "openclaw-mac", targets: ["OpenClawMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/OpenClawKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "OpenClawIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OpenClawDiscovery",
            dependencies: [
                .product(name: "OpenClawKit", package: "OpenClawKit"),
            ],
            path: "Sources/OpenClawDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "OpenClaw",
            dependencies: [
                "OpenClawIPC",
                "OpenClawDiscovery",
                .product(name: "OpenClawKit", package: "OpenClawKit"),
                .product(name: "OpenClawChatUI", package: "OpenClawKit"),
                .product(name: "OpenClawProtocol", package: "OpenClawKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/OpenClaw.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "OpenClawMacCLI",
            dependencies: [
                "OpenClawDiscovery",
                .product(name: "OpenClawKit", package: "OpenClawKit"),
                .product(name: "OpenClawProtocol", package: "OpenClawKit"),
            ],
            path: "Sources/OpenClawMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "OpenClawIPCTests",
            dependencies: [
                "OpenClawIPC",
                "OpenClaw",
                "OpenClawDiscovery",
                .product(name: "OpenClawProtocol", package: "OpenClawKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
