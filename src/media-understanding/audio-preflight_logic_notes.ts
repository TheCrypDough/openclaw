/*
 * AUTO ANNOTATION
 * File: src/media-understanding/audio-preflight.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenClawConfig } from "../config/config.js";
import { logVerbose, shouldLogVerbose } from "../globals.js";
import { isAudioAttachment } from "./attachments.js";
import {
  type ActiveMediaModel,
  buildProviderRegistry,
  createMediaAttachmentCache,
  normalizeMediaAttachments,
  resolveMediaAttachmentLocalRoots,
  runCapability,
} from "./runner.js";
import type { MediaUnderstandingProvider } from "./types.js";

/**
 * Transcribes the first audio attachment BEFORE mention checking.
 * This allows voice notes to be processed in group chats with requireMention: true.
 * Returns the transcript or undefined if transcription fails or no audio is found.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function transcribeFirstAudio(params: {
  ctx: MsgContext;
  cfg: OpenClawConfig;
  agentDir?: string;
  providers?: Record<string, MediaUnderstandingProvider>;
  activeModel?: ActiveMediaModel;
}): Promise<string | undefined> {
  const { ctx, cfg } = params;

  // Check if audio transcription is enabled in config
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const audioConfig = cfg.tools?.media?.audio;
  if (!audioConfig || audioConfig.enabled === false) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const attachments = normalizeMediaAttachments(ctx);
  if (!attachments || attachments.length === 0) {
    return undefined;
  }

  // Find first audio attachment
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const firstAudio = attachments.find(
    (att) => att && isAudioAttachment(att) && !att.alreadyTranscribed,
  );

  if (!firstAudio) {
    return undefined;
  }

  if (shouldLogVerbose()) {
    logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerRegistry = buildProviderRegistry(params.providers);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cache = createMediaAttachmentCache(attachments, {
    localPathRoots: resolveMediaAttachmentLocalRoots({ cfg, ctx }),
  });

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await runCapability({
      capability: "audio",
      cfg,
      ctx,
      attachments: cache,
      media: attachments,
      agentDir: params.agentDir,
      providerRegistry,
      config: audioConfig,
      activeModel: params.activeModel,
    });

    if (!result || result.outputs.length === 0) {
      return undefined;
    }

    // Extract transcript from first audio output
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const audioOutput = result.outputs.find((output) => output.kind === "audio.transcription");
    if (!audioOutput || !audioOutput.text) {
      return undefined;
    }

    // Mark this attachment as transcribed to avoid double-processing
    firstAudio.alreadyTranscribed = true;

    if (shouldLogVerbose()) {
      logVerbose(
        `audio-preflight: transcribed ${audioOutput.text.length} chars from attachment ${firstAudio.index}`,
      );
    }

    return audioOutput.text;
  } catch (err) {
    // Log but don't throw - let the message proceed with text-only mention check
    if (shouldLogVerbose()) {
      logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
    }
    return undefined;
  } finally {
    await cache.cleanup();
  }
}
