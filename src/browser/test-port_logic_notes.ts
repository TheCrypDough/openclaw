/*
 * AUTO ANNOTATION
 * File: src/browser/test-port.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function getFreePort(): Promise<number> {
  while (true) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const port = await new Promise<number>((resolve, reject) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const s = createServer();
      s.once("error", reject);
      s.listen(0, "127.0.0.1", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const assigned = (s.address() as AddressInfo).port;
        s.close((err) => (err ? reject(err) : resolve(assigned)));
      });
    });
    if (port < 65535) {
      return port;
    }
  }
}
