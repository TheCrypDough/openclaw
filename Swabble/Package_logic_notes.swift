/*
 * AUTO ANNOTATION
 * File: Swabble/Package.swift
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
// swift-tools-version: 6.2
import PackageDescription

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let package = Package(
    name: "swabble",
    platforms: [
        .macOS(.v15),
        .iOS(.v17),
    ],
    products: [
        .library(name: "Swabble", targets: ["Swabble"]),
        .library(name: "SwabbleKit", targets: ["SwabbleKit"]),
        .executable(name: "swabble", targets: ["SwabbleCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/Commander.git", exact: "0.2.1"),
        .package(url: "https://github.com/apple/swift-testing", from: "0.99.0"),
    ],
    targets: [
        .target(
            name: "Swabble",
            path: "Sources/SwabbleCore",
            swiftSettings: []),
        .target(
            name: "SwabbleKit",
            path: "Sources/SwabbleKit",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "SwabbleCLI",
            dependencies: [
                "Swabble",
                "SwabbleKit",
                .product(name: "Commander", package: "Commander"),
            ],
            path: "Sources/swabble"),
        .testTarget(
            name: "SwabbleKitTests",
            dependencies: [
                "SwabbleKit",
                .product(name: "Testing", package: "swift-testing"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
        .testTarget(
            name: "swabbleTests",
            dependencies: [
                "Swabble",
                .product(name: "Testing", package: "swift-testing"),
            ]),
    ],
    swiftLanguageModes: [.v6])
