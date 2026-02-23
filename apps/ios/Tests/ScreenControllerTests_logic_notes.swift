/*
 * AUTO ANNOTATION
 * File: apps/ios/Tests/ScreenControllerTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Testing
import WebKit
@testable import OpenClaw

@MainActor
private func mountScreen(_ screen: ScreenController) throws -> (ScreenWebViewCoordinator, WKWebView) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let coordinator = ScreenWebViewCoordinator(controller: screen)
    _ = coordinator.makeContainerView()
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let webView = try #require(coordinator.managedWebView)
    return (coordinator, webView)
}

@Suite struct ScreenControllerTests {
    @Test @MainActor func canvasModeConfiguresWebViewForTouch() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let screen = ScreenController()
        let (coordinator, webView) = try mountScreen(screen)
        defer { coordinator.teardown() }

        #expect(webView.isOpaque == true)
        #expect(webView.backgroundColor == .black)

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let scrollView = webView.scrollView
        #expect(scrollView.backgroundColor == .black)
        #expect(scrollView.contentInsetAdjustmentBehavior == .never)
        #expect(scrollView.isScrollEnabled == false)
        #expect(scrollView.bounces == false)
    }

    @Test @MainActor func navigateEnablesScrollForWebPages() throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let screen = ScreenController()
        let (coordinator, webView) = try mountScreen(screen)
        defer { coordinator.teardown() }

        screen.navigate(to: "https://example.com")

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let scrollView = webView.scrollView
        #expect(scrollView.isScrollEnabled == true)
        #expect(scrollView.bounces == true)
    }

    @Test @MainActor func navigateSlashShowsDefaultCanvas() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let screen = ScreenController()
        screen.navigate(to: "/")

        #expect(screen.urlString.isEmpty)
    }

    @Test @MainActor func evalExecutesJavaScript() async throws {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let screen = ScreenController()
        let (coordinator, _) = try mountScreen(screen)
        defer { coordinator.teardown() }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let deadline = ContinuousClock().now.advanced(by: .seconds(3))

        while true {
            do {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
                let result = try await screen.eval(javaScript: "1+1")
                #expect(result == "2")
                return
            } catch {
                if ContinuousClock().now >= deadline {
                    throw error
                }
                try? await Task.sleep(nanoseconds: 100_000_000)
            }
        }
    }

    @Test @MainActor func localNetworkCanvasURLsAreAllowed() {
        let screen = ScreenController()
        #expect(screen.isLocalNetworkCanvasURL(URL(string: "http://localhost:18789/")!) == true)
        #expect(screen.isLocalNetworkCanvasURL(URL(string: "http://openclaw.local:18789/")!) == true)
        #expect(screen.isLocalNetworkCanvasURL(URL(string: "http://peters-mac-studio-1:18789/")!) == true)
        #expect(screen.isLocalNetworkCanvasURL(URL(string: "https://peters-mac-studio-1.ts.net:18789/")!) == true)
        #expect(screen.isLocalNetworkCanvasURL(URL(string: "http://192.168.0.10:18789/")!) == true)
        #expect(screen.isLocalNetworkCanvasURL(URL(string: "http://10.0.0.10:18789/")!) == true)
        #expect(screen.isLocalNetworkCanvasURL(URL(string: "http://100.123.224.76:18789/")!) == true) // Tailscale CGNAT
        #expect(screen.isLocalNetworkCanvasURL(URL(string: "https://example.com/")!) == false)
        #expect(screen.isLocalNetworkCanvasURL(URL(string: "http://8.8.8.8/")!) == false)
    }

    @Test func parseA2UIActionBodyAcceptsJSONString() throws {
        let body = ScreenController.parseA2UIActionBody("{\"userAction\":{\"name\":\"hello\"}}")
        let userAction = try #require(body?["userAction"] as? [String: Any])
        #expect(userAction["name"] as? String == "hello")
    }
}
