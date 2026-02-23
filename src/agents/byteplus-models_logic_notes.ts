/*
 * AUTO ANNOTATION
 * File: src/agents/byteplus-models.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ModelDefinitionConfig } from "../config/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BYTEPLUS_BASE_URL = "https://ark.ap-southeast.bytepluses.com/api/v3";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BYTEPLUS_CODING_BASE_URL = "https://ark.ap-southeast.bytepluses.com/api/coding/v3";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BYTEPLUS_DEFAULT_MODEL_ID = "seed-1-8-251228";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BYTEPLUS_CODING_DEFAULT_MODEL_ID = "ark-code-latest";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BYTEPLUS_DEFAULT_MODEL_REF = `byteplus/${BYTEPLUS_DEFAULT_MODEL_ID}`;

// BytePlus pricing (approximate, adjust based on actual pricing)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BYTEPLUS_DEFAULT_COST = {
  input: 0.0001, // $0.0001 per 1K tokens
  output: 0.0002, // $0.0002 per 1K tokens
  cacheRead: 0,
  cacheWrite: 0,
};

/**
 * Complete catalog of BytePlus ARK models.
 *
 * BytePlus ARK provides access to various models
 * through the ARK API. Authentication requires a BYTEPLUS_API_KEY.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BYTEPLUS_MODEL_CATALOG = [
  {
    id: "seed-1-8-251228",
    name: "Seed 1.8",
    reasoning: false,
    input: ["text", "image"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
  {
    id: "kimi-k2-5-260127",
    name: "Kimi K2.5",
    reasoning: false,
    input: ["text", "image"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
  {
    id: "glm-4-7-251222",
    name: "GLM 4.7",
    reasoning: false,
    input: ["text", "image"] as const,
    contextWindow: 200000,
    maxTokens: 4096,
  },
] as const;

export type BytePlusCatalogEntry = (typeof BYTEPLUS_MODEL_CATALOG)[number];
export type BytePlusCodingCatalogEntry = (typeof BYTEPLUS_CODING_MODEL_CATALOG)[number];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildBytePlusModelDefinition(
  entry: BytePlusCatalogEntry | BytePlusCodingCatalogEntry,
): ModelDefinitionConfig {
  return {
    id: entry.id,
    name: entry.name,
    reasoning: entry.reasoning,
    input: [...entry.input],
    cost: BYTEPLUS_DEFAULT_COST,
    contextWindow: entry.contextWindow,
    maxTokens: entry.maxTokens,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BYTEPLUS_CODING_MODEL_CATALOG = [
  {
    id: "ark-code-latest",
    name: "Ark Coding Plan",
    reasoning: false,
    input: ["text"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
  {
    id: "doubao-seed-code",
    name: "Doubao Seed Code",
    reasoning: false,
    input: ["text"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
  {
    id: "glm-4.7",
    name: "GLM 4.7 Coding",
    reasoning: false,
    input: ["text"] as const,
    contextWindow: 200000,
    maxTokens: 4096,
  },
  {
    id: "kimi-k2-thinking",
    name: "Kimi K2 Thinking",
    reasoning: false,
    input: ["text"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
  {
    id: "kimi-k2.5",
    name: "Kimi K2.5 Coding",
    reasoning: false,
    input: ["text"] as const,
    contextWindow: 256000,
    maxTokens: 4096,
  },
] as const;
