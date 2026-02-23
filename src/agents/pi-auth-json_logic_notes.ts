/*
 * AUTO ANNOTATION
 * File: src/agents/pi-auth-json.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { ensureAuthProfileStore } from "./auth-profiles.js";
import type { AuthProfileCredential } from "./auth-profiles/types.js";
import { normalizeProviderId } from "./model-selection.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AuthJsonCredential =
  | {
      type: "api_key";
      key: string;
    }
  | {
      type: "oauth";
      access: string;
      refresh: string;
      expires: number;
      [key: string]: unknown;
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AuthJsonShape = Record<string, AuthJsonCredential>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function readAuthJson(filePath: string): Promise<AuthJsonShape> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await fs.readFile(filePath, "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed as AuthJsonShape;
  } catch {
    return {};
  }
}

/**
 * Convert an OpenClaw auth-profiles credential to pi-coding-agent auth.json format.
 * Returns null if the credential cannot be converted.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function convertCredential(cred: AuthProfileCredential): AuthJsonCredential | null {
  if (cred.type === "api_key") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = typeof cred.key === "string" ? cred.key.trim() : "";
    if (!key) {
      return null;
    }
    return { type: "api_key", key };
  }

  if (cred.type === "token") {
    // pi-coding-agent treats static tokens as api_key type
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const token = typeof cred.token === "string" ? cred.token.trim() : "";
    if (!token) {
      return null;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const expires =
      typeof (cred as { expires?: unknown }).expires === "number"
        ? (cred as { expires: number }).expires
        : Number.NaN;
    if (Number.isFinite(expires) && expires > 0 && Date.now() >= expires) {
      return null;
    }
    return { type: "api_key", key: token };
  }

  if (cred.type === "oauth") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accessRaw = (cred as { access?: unknown }).access;
    const refreshRaw = (cred as { refresh?: unknown }).refresh;
    const expiresRaw = (cred as { expires?: unknown }).expires;

    const access = typeof accessRaw === "string" ? accessRaw.trim() : "";
    const refresh = typeof refreshRaw === "string" ? refreshRaw.trim() : "";
    const expires = typeof expiresRaw === "number" ? expiresRaw : Number.NaN;

    if (!access || !refresh || !Number.isFinite(expires) || expires <= 0) {
      return null;
    }
    return { type: "oauth", access, refresh, expires };
  }

  return null;
}

/**
 * Check if two auth.json credentials are equivalent.
 */
function credentialsEqual(a: AuthJsonCredential | undefined, b: AuthJsonCredential): boolean {
  if (!a || typeof a !== "object") {
    return false;
  }
  if (a.type !== b.type) {
    return false;
  }

  if (a.type === "api_key" && b.type === "api_key") {
    return a.key === b.key;
  }

  if (a.type === "oauth" && b.type === "oauth") {
    return a.access === b.access && a.refresh === b.refresh && a.expires === b.expires;
  }

  return false;
}

/**
 * pi-coding-agent's ModelRegistry/AuthStorage expects credentials in auth.json.
 *
 * OpenClaw stores credentials in auth-profiles.json instead. This helper
 * bridges all credentials into agentDir/auth.json so pi-coding-agent can
 * (a) consider providers authenticated and (b) include built-in models in its
 * registry/catalog output.
 *
 * Syncs all credential types: api_key, token (as api_key), and oauth.
 */
export async function ensurePiAuthJsonFromAuthProfiles(agentDir: string): Promise<{
  wrote: boolean;
  authPath: string;
}> {
  const store = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
  const authPath = path.join(agentDir, "auth.json");

  // Group profiles by provider, taking the first valid profile for each
  const providerCredentials = new Map<string, AuthJsonCredential>();

  for (const [, cred] of Object.entries(store.profiles)) {
    const provider = normalizeProviderId(String(cred.provider ?? "")).trim();
    if (!provider || providerCredentials.has(provider)) {
      continue;
    }

    const converted = convertCredential(cred);
    if (converted) {
      providerCredentials.set(provider, converted);
    }
  }

  if (providerCredentials.size === 0) {
    return { wrote: false, authPath };
  }

  const existing = await readAuthJson(authPath);
  let changed = false;

  for (const [provider, cred] of providerCredentials) {
    if (!credentialsEqual(existing[provider], cred)) {
      existing[provider] = cred;
      changed = true;
    }
  }

  if (!changed) {
    return { wrote: false, authPath };
  }

  await fs.mkdir(agentDir, { recursive: true, mode: 0o700 });
  await fs.writeFile(authPath, `${JSON.stringify(existing, null, 2)}\n`, { mode: 0o600 });

  return { wrote: true, authPath };
}
