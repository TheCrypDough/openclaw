/*
 * AUTO ANNOTATION
 * File: src/imessage/probe.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { probeIMessage } from "./probe.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const detectBinaryMock = vi.hoisted(() => vi.fn());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const runCommandWithTimeoutMock = vi.hoisted(() => vi.fn());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createIMessageRpcClientMock = vi.hoisted(() => vi.fn());

vi.mock("../commands/onboard-helpers.js", () => ({
  detectBinary: (...args: unknown[]) => detectBinaryMock(...args),
}));

vi.mock("../process/exec.js", () => ({
  runCommandWithTimeout: (...args: unknown[]) => runCommandWithTimeoutMock(...args),
}));

vi.mock("./client.js", () => ({
  createIMessageRpcClient: (...args: unknown[]) => createIMessageRpcClientMock(...args),
}));

beforeEach(() => {
  detectBinaryMock.mockReset().mockResolvedValue(true);
  runCommandWithTimeoutMock.mockReset().mockResolvedValue({
    stdout: "",
    stderr: 'unknown command "rpc" for "imsg"',
    code: 1,
    signal: null,
    killed: false,
  });
  createIMessageRpcClientMock.mockReset();
});

describe("probeIMessage", () => {
  it("marks unknown rpc subcommand as fatal", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await probeIMessage(1000, { cliPath: "imsg" });
    expect(result.ok).toBe(false);
    expect(result.fatal).toBe(true);
    expect(result.error).toMatch(/rpc/i);
    expect(createIMessageRpcClientMock).not.toHaveBeenCalled();
  });
});
