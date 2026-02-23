/*
 * AUTO ANNOTATION
 * File: src/media-understanding/runner.test-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { MsgContext } from "../auto-reply/templating.js";
import { withEnvAsync } from "../test-utils/env.js";
import { createMediaAttachmentCache, normalizeMediaAttachments } from "./runner.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AudioFixtureParams = {
  ctx: MsgContext;
  media: ReturnType<typeof normalizeMediaAttachments>;
  cache: ReturnType<typeof createMediaAttachmentCache>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withAudioFixture(
  filePrefix: string,
  run: (params: AudioFixtureParams) => Promise<void>,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tmpPath = path.join(os.tmpdir(), filePrefix + "-" + Date.now().toString() + ".wav");
  await fs.writeFile(tmpPath, Buffer.from("RIFF"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ctx: MsgContext = { MediaPath: tmpPath, MediaType: "audio/wav" };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const media = normalizeMediaAttachments(ctx);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cache = createMediaAttachmentCache(media, {
    localPathRoots: [path.dirname(tmpPath)],
  });

  try {
    await withEnvAsync({ PATH: "" }, async () => {
      await run({ ctx, media, cache });
    });
  } finally {
    await cache.cleanup();
    await fs.unlink(tmpPath).catch(() => {});
  }
}
