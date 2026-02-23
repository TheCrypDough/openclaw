/*
 * AUTO ANNOTATION
 * File: src/commands/models.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { githubCopilotLoginCommand } from "../providers/github-copilot-auth.js";
export {
  modelsAliasesAddCommand,
  modelsAliasesListCommand,
  modelsAliasesRemoveCommand,
} from "./models/aliases.js";
export {
  modelsAuthAddCommand,
  modelsAuthLoginCommand,
  modelsAuthPasteTokenCommand,
  modelsAuthSetupTokenCommand,
} from "./models/auth.js";
export {
  modelsAuthOrderClearCommand,
  modelsAuthOrderGetCommand,
  modelsAuthOrderSetCommand,
} from "./models/auth-order.js";
export {
  modelsFallbacksAddCommand,
  modelsFallbacksClearCommand,
  modelsFallbacksListCommand,
  modelsFallbacksRemoveCommand,
} from "./models/fallbacks.js";
export {
  modelsImageFallbacksAddCommand,
  modelsImageFallbacksClearCommand,
  modelsImageFallbacksListCommand,
  modelsImageFallbacksRemoveCommand,
} from "./models/image-fallbacks.js";
export { modelsListCommand, modelsStatusCommand } from "./models/list.js";
export { modelsScanCommand } from "./models/scan.js";
export { modelsSetCommand } from "./models/set.js";
export { modelsSetImageCommand } from "./models/set-image.js";
