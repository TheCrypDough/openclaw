/*
 * AUTO ANNOTATION
 * File: extensions/twitch/src/probe.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { StaticAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import type { BaseProbeResult } from "openclaw/plugin-sdk";
import type { TwitchAccountConfig } from "./types.js";
import { normalizeToken } from "./utils/twitch.js";

/**
 * Result of probing a Twitch account
 */
export type ProbeTwitchResult = BaseProbeResult<string> & {
  username?: string;
  elapsedMs: number;
  connected?: boolean;
  channel?: string;
};

/**
 * Probe a Twitch account to verify the connection is working
 *
 * This tests the Twitch OAuth token by attempting to connect
 * to the chat server and verify the bot's username.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function probeTwitch(
  account: TwitchAccountConfig,
  timeoutMs: number,
): Promise<ProbeTwitchResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const started = Date.now();

  if (!account.accessToken || !account.username) {
    return {
      ok: false,
      error: "missing credentials (accessToken, username)",
      username: account.username,
      elapsedMs: Date.now() - started,
    };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawToken = normalizeToken(account.accessToken.trim());

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let client: ChatClient | undefined;

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const authProvider = new StaticAuthProvider(account.clientId ?? "", rawToken);

    client = new ChatClient({
      authProvider,
    });

    // Create a promise that resolves when connected
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const connectionPromise = new Promise<void>((resolve, reject) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let settled = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let connectListener: ReturnType<ChatClient["onConnect"]> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let disconnectListener: ReturnType<ChatClient["onDisconnect"]> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let authFailListener: ReturnType<ChatClient["onAuthenticationFailure"]> | undefined;

      const cleanup = () => {
        if (settled) {
          return;
        }
        settled = true;
        connectListener?.unbind();
        disconnectListener?.unbind();
        authFailListener?.unbind();
      };

      // Success: connection established
      connectListener = client?.onConnect(() => {
        cleanup();
        resolve();
      });

      // Failure: disconnected (e.g., auth failed)
      disconnectListener = client?.onDisconnect((_manually, reason) => {
        cleanup();
        reject(reason || new Error("Disconnected"));
      });

      // Failure: authentication failed
      authFailListener = client?.onAuthenticationFailure(() => {
        cleanup();
        reject(new Error("Authentication failed"));
      });
    });

    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`timeout after ${timeoutMs}ms`)), timeoutMs);
    });

    client.connect();
    await Promise.race([connectionPromise, timeout]);

    client.quit();
    client = undefined;

    return {
      ok: true,
      connected: true,
      username: account.username,
      channel: account.channel,
      elapsedMs: Date.now() - started,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      username: account.username,
      channel: account.channel,
      elapsedMs: Date.now() - started,
    };
  } finally {
    if (client) {
      try {
        client.quit();
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
