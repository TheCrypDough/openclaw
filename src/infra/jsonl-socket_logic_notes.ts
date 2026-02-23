/*
 * AUTO ANNOTATION
 * File: src/infra/jsonl-socket.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import net from "node:net";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function requestJsonlSocket<T>(params: {
  socketPath: string;
  payload: string;
  timeoutMs: number;
  accept: (msg: unknown) => T | null | undefined;
}): Promise<T | null> {
  const { socketPath, payload, timeoutMs, accept } = params;
  return await new Promise((resolve) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = new net.Socket();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let settled = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let buffer = "";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const finish = (value: T | null) => {
      if (settled) {
        return;
      }
      settled = true;
      try {
        client.destroy();
      } catch {
        // ignore
      }
      resolve(value);
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const timer = setTimeout(() => finish(null), timeoutMs);

    client.on("error", () => finish(null));
    client.connect(socketPath, () => {
      client.write(`${payload}\n`);
    });
    client.on("data", (data) => {
      buffer += data.toString("utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let idx = buffer.indexOf("\n");
      while (idx !== -1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        idx = buffer.indexOf("\n");
        if (!line) {
          continue;
        }
        try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const msg = JSON.parse(line) as unknown;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const result = accept(msg);
          if (result === undefined) {
            continue;
          }
          clearTimeout(timer);
          finish(result);
          return;
        } catch {
          // ignore
        }
      }
    });
  });
}
