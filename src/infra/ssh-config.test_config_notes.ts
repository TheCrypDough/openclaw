# AUTOPLACEHOLDER_ANNOTATION: src/infra/ssh-config.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { spawn, type ChildProcess, type SpawnOptions } from "node:child_process";
import { EventEmitter } from "node:events";
import { beforeAll, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MockSpawnChild = EventEmitter & {
  stdout?: EventEmitter & { setEncoding?: (enc: string) => void };
  kill?: (signal?: string) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createMockSpawnChild() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const child = new EventEmitter() as MockSpawnChild;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stdout = new EventEmitter() as MockSpawnChild["stdout"];
  stdout!.setEncoding = vi.fn();
  child.stdout = stdout;
  child.kill = vi.fn();
  return { child, stdout };
}

vi.mock("node:child_process", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const spawn = vi.fn(() => {
    const { child, stdout } = createMockSpawnChild();
    process.nextTick(() => {
      stdout?.emit(
        "data",
        [
          "user steipete",
          "hostname peters-mac-studio-1.sheep-coho.ts.net",
          "port 2222",
          "identityfile none",
          "identityfile /tmp/id_ed25519",
          "",
        ].join("\n"),
      );
      child.emit("exit", 0);
    });
    return child;
  });
  return { spawn };
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const spawnMock = vi.mocked(spawn);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let parseSshConfigOutput: typeof import("./ssh-config.js").parseSshConfigOutput;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let resolveSshConfig: typeof import("./ssh-config.js").resolveSshConfig;

describe("ssh-config", () => {
  beforeAll(async () => {
    ({ parseSshConfigOutput, resolveSshConfig } = await import("./ssh-config.js"));
  });

  it("parses ssh -G output", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = parseSshConfigOutput(
      "user bob\nhostname example.com\nport 2222\nidentityfile none\nidentityfile /tmp/id\n",
    );
    expect(parsed.user).toBe("bob");
    expect(parsed.host).toBe("example.com");
    expect(parsed.port).toBe(2222);
    expect(parsed.identityFiles).toEqual(["/tmp/id"]);
  });

  it("resolves ssh config via ssh -G", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = await resolveSshConfig({ user: "me", host: "alias", port: 22 });
    expect(config?.user).toBe("steipete");
    expect(config?.host).toBe("peters-mac-studio-1.sheep-coho.ts.net");
    expect(config?.port).toBe(2222);
    expect(config?.identityFiles).toEqual(["/tmp/id_ed25519"]);
    const args = spawnMock.mock.calls[0]?.[1] as string[] | undefined;
    expect(args?.slice(-2)).toEqual(["--", "me@alias"]);
  });

  it("returns null when ssh -G fails", async () => {
    spawnMock.mockImplementationOnce(
      (_command: string, _args: readonly string[], _options: SpawnOptions): ChildProcess => {
        const { child } = createMockSpawnChild();
        process.nextTick(() => {
          child.emit("exit", 1);
        });
        return child as unknown as ChildProcess;
      },
    );

    const config = await resolveSshConfig({ user: "me", host: "bad-host", port: 22 });
    expect(config).toBeNull();
  });
});
