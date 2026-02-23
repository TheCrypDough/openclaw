/*
 * AUTO ANNOTATION
 * File: src/cli/browser-cli-state.cookies-storage.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { danger } from "../globals.js";
import { defaultRuntime } from "../runtime.js";
import { callBrowserRequest, type BrowserParentOpts } from "./browser-cli-shared.js";
import { inheritOptionFromParent } from "./command-options.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveTargetId(rawTargetId: unknown, command: Command): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const local = typeof rawTargetId === "string" ? rawTargetId.trim() : "";
  if (local) {
    return local;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const inherited = inheritOptionFromParent<string>(command, "targetId");
  if (typeof inherited !== "string") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = inherited.trim();
  return trimmed ? trimmed : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerBrowserCookiesAndStorageCommands(
  browser: Command,
  parentOpts: (cmd: Command) => BrowserParentOpts,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cookies = browser.command("cookies").description("Read/write cookies");

  cookies
    .option("--target-id <id>", "CDP target id (or unique prefix)")
    .action(async (opts, cmd) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const parent = parentOpts(cmd);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const profile = parent?.browserProfile;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const targetId = resolveTargetId(opts.targetId, cmd);
      try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const result = await callBrowserRequest<{ cookies?: unknown[] }>(
          parent,
          {
            method: "GET",
            path: "/cookies",
            query: {
              targetId,
              profile,
            },
          },
          { timeoutMs: 20000 },
        );
        if (parent?.json) {
          defaultRuntime.log(JSON.stringify(result, null, 2));
          return;
        }
        defaultRuntime.log(JSON.stringify(result.cookies ?? [], null, 2));
      } catch (err) {
        defaultRuntime.error(danger(String(err)));
        defaultRuntime.exit(1);
      }
    });

  cookies
    .command("set")
    .description("Set a cookie (requires --url or domain+path)")
    .argument("<name>", "Cookie name")
    .argument("<value>", "Cookie value")
    .requiredOption("--url <url>", "Cookie URL scope (recommended)")
    .option("--target-id <id>", "CDP target id (or unique prefix)")
    .action(async (name: string, value: string, opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      const targetId = resolveTargetId(opts.targetId, cmd);
      try {
        const result = await callBrowserRequest(
          parent,
          {
            method: "POST",
            path: "/cookies/set",
            query: profile ? { profile } : undefined,
            body: {
              targetId,
              cookie: { name, value, url: opts.url },
            },
          },
          { timeoutMs: 20000 },
        );
        if (parent?.json) {
          defaultRuntime.log(JSON.stringify(result, null, 2));
          return;
        }
        defaultRuntime.log(`cookie set: ${name}`);
      } catch (err) {
        defaultRuntime.error(danger(String(err)));
        defaultRuntime.exit(1);
      }
    });

  cookies
    .command("clear")
    .description("Clear all cookies")
    .option("--target-id <id>", "CDP target id (or unique prefix)")
    .action(async (opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      const targetId = resolveTargetId(opts.targetId, cmd);
      try {
        const result = await callBrowserRequest(
          parent,
          {
            method: "POST",
            path: "/cookies/clear",
            query: profile ? { profile } : undefined,
            body: {
              targetId,
            },
          },
          { timeoutMs: 20000 },
        );
        if (parent?.json) {
          defaultRuntime.log(JSON.stringify(result, null, 2));
          return;
        }
        defaultRuntime.log("cookies cleared");
      } catch (err) {
        defaultRuntime.error(danger(String(err)));
        defaultRuntime.exit(1);
      }
    });

  const storage = browser.command("storage").description("Read/write localStorage/sessionStorage");

  function registerStorageKind(kind: "local" | "session") {
    const cmd = storage.command(kind).description(`${kind}Storage commands`);

    cmd
      .command("get")
      .description(`Get ${kind}Storage (all keys or one key)`)
      .argument("[key]", "Key (optional)")
      .option("--target-id <id>", "CDP target id (or unique prefix)")
      .action(async (key: string | undefined, opts, cmd2) => {
        const parent = parentOpts(cmd2);
        const profile = parent?.browserProfile;
        const targetId = resolveTargetId(opts.targetId, cmd2);
        try {
          const result = await callBrowserRequest<{ values?: Record<string, string> }>(
            parent,
            {
              method: "GET",
              path: `/storage/${kind}`,
              query: {
                key: key?.trim() || undefined,
                targetId,
                profile,
              },
            },
            { timeoutMs: 20000 },
          );
          if (parent?.json) {
            defaultRuntime.log(JSON.stringify(result, null, 2));
            return;
          }
          defaultRuntime.log(JSON.stringify(result.values ?? {}, null, 2));
        } catch (err) {
          defaultRuntime.error(danger(String(err)));
          defaultRuntime.exit(1);
        }
      });

    cmd
      .command("set")
      .description(`Set a ${kind}Storage key`)
      .argument("<key>", "Key")
      .argument("<value>", "Value")
      .option("--target-id <id>", "CDP target id (or unique prefix)")
      .action(async (key: string, value: string, opts, cmd2) => {
        const parent = parentOpts(cmd2);
        const profile = parent?.browserProfile;
        const targetId = resolveTargetId(opts.targetId, cmd2);
        try {
          const result = await callBrowserRequest(
            parent,
            {
              method: "POST",
              path: `/storage/${kind}/set`,
              query: profile ? { profile } : undefined,
              body: {
                key,
                value,
                targetId,
              },
            },
            { timeoutMs: 20000 },
          );
          if (parent?.json) {
            defaultRuntime.log(JSON.stringify(result, null, 2));
            return;
          }
          defaultRuntime.log(`${kind}Storage set: ${key}`);
        } catch (err) {
          defaultRuntime.error(danger(String(err)));
          defaultRuntime.exit(1);
        }
      });

    cmd
      .command("clear")
      .description(`Clear all ${kind}Storage keys`)
      .option("--target-id <id>", "CDP target id (or unique prefix)")
      .action(async (opts, cmd2) => {
        const parent = parentOpts(cmd2);
        const profile = parent?.browserProfile;
        const targetId = resolveTargetId(opts.targetId, cmd2);
        try {
          const result = await callBrowserRequest(
            parent,
            {
              method: "POST",
              path: `/storage/${kind}/clear`,
              query: profile ? { profile } : undefined,
              body: {
                targetId,
              },
            },
            { timeoutMs: 20000 },
          );
          if (parent?.json) {
            defaultRuntime.log(JSON.stringify(result, null, 2));
            return;
          }
          defaultRuntime.log(`${kind}Storage cleared`);
        } catch (err) {
          defaultRuntime.error(danger(String(err)));
          defaultRuntime.exit(1);
        }
      });
  }

  registerStorageKind("local");
  registerStorageKind("session");
}
