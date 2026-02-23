/*
 * AUTO ANNOTATION
 * File: src/media/server.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import type { Server } from "node:http";
import express, { type Express } from "express";
import { danger } from "../globals.js";
import { SafeOpenError, openFileWithinRoot } from "../infra/fs-safe.js";
import { defaultRuntime, type RuntimeEnv } from "../runtime.js";
import { detectMime } from "./mime.js";
import { cleanOldMedia, getMediaDir, MEDIA_MAX_BYTES } from "./store.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_TTL_MS = 2 * 60 * 1000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_MEDIA_ID_CHARS = 200;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MEDIA_ID_PATTERN = /^[\p{L}\p{N}._-]+$/u;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_MEDIA_BYTES = MEDIA_MAX_BYTES;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const isValidMediaId = (id: string) => {
  if (!id) {
    return false;
  }
  if (id.length > MAX_MEDIA_ID_CHARS) {
    return false;
  }
  if (id === "." || id === "..") {
    return false;
  }
  return MEDIA_ID_PATTERN.test(id);
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function attachMediaRoutes(
  app: Express,
  ttlMs = DEFAULT_TTL_MS,
  _runtime: RuntimeEnv = defaultRuntime,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mediaDir = getMediaDir();

  app.get("/media/:id", async (req, res) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = req.params.id;
    if (!isValidMediaId(id)) {
      res.status(400).send("invalid path");
      return;
    }
    try {
      const { handle, realPath, stat } = await openFileWithinRoot({
        rootDir: mediaDir,
        relativePath: id,
      });
      if (stat.size > MAX_MEDIA_BYTES) {
        await handle.close().catch(() => {});
        res.status(413).send("too large");
        return;
      }
      if (Date.now() - stat.mtimeMs > ttlMs) {
        await handle.close().catch(() => {});
        await fs.rm(realPath).catch(() => {});
        res.status(410).send("expired");
        return;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const data = await handle.readFile();
      await handle.close().catch(() => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const mime = await detectMime({ buffer: data, filePath: realPath });
      if (mime) {
        res.type(mime);
      }
      res.send(data);
      // best-effort single-use cleanup after response ends
      res.on("finish", () => {
        const cleanup = () => {
          void fs.rm(realPath).catch(() => {});
        };
        // Tests should not pay for time-based cleanup delays.
        if (process.env.VITEST || process.env.NODE_ENV === "test") {
          queueMicrotask(cleanup);
          return;
        }
        setTimeout(cleanup, 50);
      });
    } catch (err) {
      if (err instanceof SafeOpenError) {
        if (err.code === "invalid-path") {
          res.status(400).send("invalid path");
          return;
        }
        if (err.code === "not-found") {
          res.status(404).send("not found");
          return;
        }
      }
      res.status(404).send("not found");
    }
  });

  // periodic cleanup
  setInterval(() => {
    void cleanOldMedia(ttlMs);
  }, ttlMs).unref();
}

export async function startMediaServer(
  port: number,
  ttlMs = DEFAULT_TTL_MS,
  runtime: RuntimeEnv = defaultRuntime,
): Promise<Server> {
  const app = express();
  attachMediaRoutes(app, ttlMs, runtime);
  return await new Promise((resolve, reject) => {
    const server = app.listen(port, "127.0.0.1");
    server.once("listening", () => resolve(server));
    server.once("error", (err) => {
      runtime.error(danger(`Media server failed: ${String(err)}`));
      reject(err);
    });
  });
}
