# AUTOPLACEHOLDER_ANNOTATION: src/commands/configure.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
export {
  configureCommand,
  configureCommandFromSectionsArg,
  configureCommandWithSections,
} from "./configure.commands.js";
export { buildGatewayAuthConfig } from "./configure.gateway-auth.js";
export {
  CONFIGURE_WIZARD_SECTIONS,
  parseConfigureWizardSections,
  type WizardSection,
} from "./configure.shared.js";
export { runConfigureWizard } from "./configure.wizard.js";
