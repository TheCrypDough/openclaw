/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/AboutSettings.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import SwiftUI

struct AboutSettings: View {
    weak var updater: UpdaterProviding?
    @State private var iconHover = false
    @AppStorage("autoUpdateEnabled") private var autoCheckEnabled = true
    @State private var didLoadUpdaterState = false

    var body: some View {
        VStack(spacing: 8) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let appIcon = NSApplication.shared.applicationIconImage ?? CritterIconRenderer.makeIcon(blink: 0)
            Button {
                if let url = URL(string: "https://github.com/openclaw/openclaw") {
                    NSWorkspace.shared.open(url)
                }
            } label: {
                Image(nsImage: appIcon)
                    .resizable()
                    .frame(width: 160, height: 160)
                    .cornerRadius(24)
                    .shadow(color: self.iconHover ? .accentColor.opacity(0.25) : .clear, radius: 10)
                    .scaleEffect(self.iconHover ? 1.05 : 1.0)
            }
            .buttonStyle(.plain)
            .focusable(false)
            .pointingHandCursor()
            .onHover { hover in
                withAnimation(.spring(response: 0.3, dampingFraction: 0.72)) { self.iconHover = hover }
            }

            VStack(spacing: 3) {
                Text("OpenClaw")
                    .font(.title3.bold())
                Text("Version \(self.versionString)")
                    .foregroundStyle(.secondary)
                if let buildTimestamp {
                    Text("Built \(buildTimestamp)\(self.buildSuffix)")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
                Text("Menu bar companion for notifications, screenshots, and privileged agent actions.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 18)
            }

            VStack(alignment: .center, spacing: 6) {
                AboutLinkRow(
                    icon: "chevron.left.slash.chevron.right",
                    title: "GitHub",
                    url: "https://github.com/openclaw/openclaw")
                AboutLinkRow(icon: "globe", title: "Website", url: "https://openclaw.ai")
                AboutLinkRow(icon: "bird", title: "Twitter", url: "https://twitter.com/steipete")
                AboutLinkRow(icon: "envelope", title: "Email", url: "mailto:peter@steipete.me")
            }
            .frame(maxWidth: .infinity)
            .multilineTextAlignment(.center)
            .padding(.vertical, 10)

            if let updater {
                Divider()
                    .padding(.vertical, 8)

                if updater.isAvailable {
                    VStack(spacing: 10) {
                        Toggle("Check for updates automatically", isOn: self.$autoCheckEnabled)
                            .toggleStyle(.checkbox)
                            .frame(maxWidth: .infinity, alignment: .center)

                        Button("Check for Updates…") { updater.checkForUpdates(nil) }
                    }
                } else {
                    Text("Updates unavailable in this build.")
                        .foregroundStyle(.secondary)
                        .padding(.top, 4)
                }
            }

            Text("© 2025 Peter Steinberger — MIT License.")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .padding(.top, 4)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 4)
        .padding(.horizontal, 24)
        .padding(.bottom, 24)
        .onAppear {
            guard let updater, !self.didLoadUpdaterState else { return }
            // Keep Sparkle’s auto-check setting in sync with the persisted toggle.
            updater.automaticallyChecksForUpdates = self.autoCheckEnabled
            updater.automaticallyDownloadsUpdates = self.autoCheckEnabled
            self.didLoadUpdaterState = true
        }
        .onChange(of: self.autoCheckEnabled) { _, newValue in
            self.updater?.automaticallyChecksForUpdates = newValue
            self.updater?.automaticallyDownloadsUpdates = newValue
        }
    }

    private var versionString: String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let version = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "dev"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let build = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String
        return build.map { "\(version) (\($0))" } ?? version
    }

    private var buildTimestamp: String? {
        guard
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            let raw =
            (Bundle.main.object(forInfoDictionaryKey: "OpenClawBuildTimestamp") as? String) ??
            (Bundle.main.object(forInfoDictionaryKey: "OpenClawBuildTimestamp") as? String)
        else { return nil }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let parser = ISO8601DateFormatter()
        parser.formatOptions = [.withInternetDateTime]
        guard let date = parser.date(from: raw) else { return raw }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        formatter.locale = .current
        return formatter.string(from: date)
    }

    private var gitCommit: String {
        (Bundle.main.object(forInfoDictionaryKey: "OpenClawGitCommit") as? String) ??
            (Bundle.main.object(forInfoDictionaryKey: "OpenClawGitCommit") as? String) ??
            "unknown"
    }

    private var bundleID: String {
        Bundle.main.bundleIdentifier ?? "unknown"
    }

    private var buildSuffix: String {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let git = self.gitCommit
        guard !git.isEmpty, git != "unknown" else { return "" }

        var suffix = " (\(git)"
        #if DEBUG
        suffix += " DEBUG"
        #endif
        suffix += ")"
        return suffix
    }
}

@MainActor
private struct AboutLinkRow: View {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let icon: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let title: String
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let url: String

    @State private var hovering = false

    var body: some View {
        Button {
            if let url = URL(string: url) { NSWorkspace.shared.open(url) }
        } label: {
            HStack(spacing: 6) {
                Image(systemName: self.icon)
                Text(self.title)
                    .underline(self.hovering, color: .accentColor)
            }
            .foregroundColor(.accentColor)
        }
        .buttonStyle(.plain)
        .onHover { self.hovering = $0 }
        .pointingHandCursor()
    }
}

private struct AboutMetaRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(self.label)
                .foregroundStyle(.secondary)
            Spacer()
            Text(self.value)
                .font(.caption.monospaced())
                .foregroundStyle(.primary)
        }
    }
}

#if DEBUG
struct AboutSettings_Previews: PreviewProvider {
    private static let updater = DisabledUpdaterController()
    static var previews: some View {
        AboutSettings(updater: updater)
            .frame(width: SettingsTab.windowWidth, height: SettingsTab.windowHeight)
    }
}
#endif
