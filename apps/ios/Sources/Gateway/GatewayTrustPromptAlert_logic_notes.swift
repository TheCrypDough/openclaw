/*
 * AUTO ANNOTATION
 * File: apps/ios/Sources/Gateway/GatewayTrustPromptAlert.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

struct GatewayTrustPromptAlert: ViewModifier {
    @Environment(GatewayConnectionController.self) private var gatewayController: GatewayConnectionController

    private var promptBinding: Binding<GatewayConnectionController.TrustPrompt?> {
        Binding(
            get: { self.gatewayController.pendingTrustPrompt },
            set: { _ in
                // Keep pending trust state until explicit user action.
                // `alert(item:)` may set the binding to nil during dismissal, which can race with
                // the button handler and cause accept to no-op.
            })
    }

    func body(content: Content) -> some View {
        content.alert(item: self.promptBinding) { prompt in
            Alert(
                title: Text("Trust this gateway?"),
                message: Text(
                    """
                    First-time TLS connection.

                    Verify this SHA-256 fingerprint out-of-band before trusting:
                    \(prompt.fingerprintSha256)
                    """),
                primaryButton: .cancel(Text("Cancel")) {
                    self.gatewayController.declinePendingTrustPrompt()
                },
                secondaryButton: .default(Text("Trust and connect")) {
                    Task { await self.gatewayController.acceptPendingTrustPrompt() }
                })
        }
    }
}

extension View {
    func gatewayTrustPromptAlert() -> some View {
        self.modifier(GatewayTrustPromptAlert())
    }
}
