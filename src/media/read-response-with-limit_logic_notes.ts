/*
 * AUTO ANNOTATION
 * File: src/media/read-response-with-limit.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readResponseWithLimit(
  res: Response,
  maxBytes: number,
  opts?: {
    onOverflow?: (params: { size: number; maxBytes: number; res: Response }) => Error;
  },
): Promise<Buffer> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const onOverflow =
    opts?.onOverflow ??
    ((params: { size: number; maxBytes: number }) =>
      new Error(`Content too large: ${params.size} bytes (limit: ${params.maxBytes} bytes)`));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const body = res.body;
  if (!body || typeof body.getReader !== "function") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fallback = Buffer.from(await res.arrayBuffer());
    if (fallback.length > maxBytes) {
      throw onOverflow({ size: fallback.length, maxBytes, res });
    }
    return fallback;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const reader = body.getReader();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chunks: Uint8Array[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (value?.length) {
        total += value.length;
        if (total > maxBytes) {
          try {
            await reader.cancel();
          } catch {}
          throw onOverflow({ size: total, maxBytes, res });
        }
        chunks.push(value);
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {}
  }

  return Buffer.concat(
    chunks.map((chunk) => Buffer.from(chunk)),
    total,
  );
}
