/*
 * AUTO ANNOTATION
 * File: apps/macos/Tests/OpenClawIPCTests/OnboardingWizardStepViewTests.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import OpenClawProtocol
import SwiftUI
import Testing
@testable import OpenClaw

private typealias ProtoAnyCodable = OpenClawProtocol.AnyCodable

@Suite(.serialized)
@MainActor
struct OnboardingWizardStepViewTests {
    @Test func noteStepBuilds() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let step = WizardStep(
            id: "step-1",
            type: ProtoAnyCodable("note"),
            title: "Welcome",
            message: "Hello",
            options: nil,
            initialvalue: nil,
            placeholder: nil,
            sensitive: nil,
            executor: nil)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = OnboardingWizardStepView(step: step, isSubmitting: false, onSubmit: { _ in })
        _ = view.body
    }

    @Test func selectStepBuilds() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let options: [[String: ProtoAnyCodable]] = [
            ["value": ProtoAnyCodable("local"), "label": ProtoAnyCodable("Local"), "hint": ProtoAnyCodable("This Mac")],
            ["value": ProtoAnyCodable("remote"), "label": ProtoAnyCodable("Remote")],
        ]
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let step = WizardStep(
            id: "step-2",
            type: ProtoAnyCodable("select"),
            title: "Mode",
            message: "Choose a mode",
            options: options,
            initialvalue: ProtoAnyCodable("local"),
            placeholder: nil,
            sensitive: nil,
            executor: nil)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let view = OnboardingWizardStepView(step: step, isSubmitting: false, onSubmit: { _ in })
        _ = view.body
    }
}
