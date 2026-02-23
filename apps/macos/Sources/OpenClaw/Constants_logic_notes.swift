/*
 * AUTO ANNOTATION
 * File: apps/macos/Sources/OpenClaw/Constants.swift
 * Purpose: File in apps area for project orchestration/configuration/data.
 * Module area: Native apps (macOS / iOS / Android / shared app assets)
 * System effect: Change can influence native apps (macos / ios / android / shared app assets) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-openclaw writes app defaults into this suite to survive app bundle identifier churn.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let launchdLabel = "ai.openclaw.mac"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let gatewayLaunchdLabel = "ai.openclaw.gateway"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let onboardingVersionKey = "openclaw.onboardingVersion"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let onboardingSeenKey = "openclaw.onboardingSeen"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let currentOnboardingVersion = 7
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let pauseDefaultsKey = "openclaw.pauseEnabled"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let iconAnimationsEnabledKey = "openclaw.iconAnimationsEnabled"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let swabbleEnabledKey = "openclaw.swabbleEnabled"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let swabbleTriggersKey = "openclaw.swabbleTriggers"
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let voiceWakeTriggerChimeKey = "openclaw.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "openclaw.voiceWakeSendChime"
let showDockIconKey = "openclaw.showDockIcon"
let defaultVoiceWakeTriggers = ["openclaw"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "openclaw.voiceWakeMicID"
let voiceWakeMicNameKey = "openclaw.voiceWakeMicName"
let voiceWakeLocaleKey = "openclaw.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "openclaw.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "openclaw.voicePushToTalkEnabled"
let talkEnabledKey = "openclaw.talkEnabled"
let iconOverrideKey = "openclaw.iconOverride"
let connectionModeKey = "openclaw.connectionMode"
let remoteTargetKey = "openclaw.remoteTarget"
let remoteIdentityKey = "openclaw.remoteIdentity"
let remoteProjectRootKey = "openclaw.remoteProjectRoot"
let remoteCliPathKey = "openclaw.remoteCliPath"
let canvasEnabledKey = "openclaw.canvasEnabled"
let cameraEnabledKey = "openclaw.cameraEnabled"
let systemRunPolicyKey = "openclaw.systemRunPolicy"
let systemRunAllowlistKey = "openclaw.systemRunAllowlist"
let systemRunEnabledKey = "openclaw.systemRunEnabled"
let locationModeKey = "openclaw.locationMode"
let locationPreciseKey = "openclaw.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "openclaw.peekabooBridgeEnabled"
let deepLinkKeyKey = "openclaw.deepLinkKey"
let modelCatalogPathKey = "openclaw.modelCatalogPath"
let modelCatalogReloadKey = "openclaw.modelCatalogReload"
let cliInstallPromptedVersionKey = "openclaw.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "openclaw.heartbeatsEnabled"
let debugPaneEnabledKey = "openclaw.debugPaneEnabled"
let debugFileLogEnabledKey = "openclaw.debug.fileLogEnabled"
let appLogLevelKey = "openclaw.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26
