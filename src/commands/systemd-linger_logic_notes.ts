/*
 * AUTO ANNOTATION
 * File: src/commands/systemd-linger.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  enableSystemdUserLinger,
  isSystemdUserServiceAvailable,
  readSystemdUserLingerStatus,
} from "../daemon/systemd.js";
import type { RuntimeEnv } from "../runtime.js";
import { note } from "../terminal/note.js";

export type LingerPrompter = {
  confirm?: (params: { message: string; initialValue?: boolean }) => Promise<boolean>;
  note: (message: string, title?: string) => Promise<void> | void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function ensureSystemdUserLingerInteractive(params: {
  runtime: RuntimeEnv;
  prompter?: LingerPrompter;
  env?: NodeJS.ProcessEnv;
  title?: string;
  reason?: string;
  prompt?: boolean;
  requireConfirm?: boolean;
}): Promise<void> {
  if (process.platform !== "linux") {
    return;
  }
  if (params.prompt === false) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const env = params.env ?? process.env;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prompter = params.prompter ?? { note };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const title = params.title ?? "Systemd";
  if (!(await isSystemdUserServiceAvailable())) {
    await prompter.note("Systemd user services are unavailable. Skipping lingering checks.", title);
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const status = await readSystemdUserLingerStatus(env);
  if (!status) {
    await prompter.note(
      "Unable to read loginctl linger status. Ensure systemd + loginctl are available.",
      title,
    );
    return;
  }
  if (status.linger === "yes") {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const reason =
    params.reason ??
    "Systemd user services stop when you log out or go idle, which kills the Gateway.";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actionNote = params.requireConfirm
    ? "We can enable lingering now (may require sudo; writes /var/lib/systemd/linger)."
    : "Enabling lingering now (may require sudo; writes /var/lib/systemd/linger).";
  await prompter.note(`${reason}\n${actionNote}`, title);

  if (params.requireConfirm && prompter.confirm) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ok = await prompter.confirm({
      message: `Enable systemd lingering for ${status.user}?`,
      initialValue: true,
    });
    if (!ok) {
      await prompter.note("Without lingering, the Gateway will stop when you log out.", title);
      return;
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resultNoSudo = await enableSystemdUserLinger({
    env,
    user: status.user,
  });
  if (resultNoSudo.ok) {
    await prompter.note(`Enabled systemd lingering for ${status.user}.`, title);
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await enableSystemdUserLinger({
    env,
    user: status.user,
    sudoMode: "prompt",
  });
  if (result.ok) {
    await prompter.note(`Enabled systemd lingering for ${status.user}.`, title);
    return;
  }

  params.runtime.error(
    `Failed to enable lingering: ${result.stderr || result.stdout || "unknown error"}`,
  );
  await prompter.note(`Run manually: sudo loginctl enable-linger ${status.user}`, title);
}

export async function ensureSystemdUserLingerNonInteractive(params: {
  runtime: RuntimeEnv;
  env?: NodeJS.ProcessEnv;
}): Promise<void> {
  if (process.platform !== "linux") {
    return;
  }
  const env = params.env ?? process.env;
  if (!(await isSystemdUserServiceAvailable())) {
    return;
  }
  const status = await readSystemdUserLingerStatus(env);
  if (!status || status.linger === "yes") {
    return;
  }

  const result = await enableSystemdUserLinger({
    env,
    user: status.user,
    sudoMode: "non-interactive",
  });
  if (result.ok) {
    params.runtime.log(`Enabled systemd lingering for ${status.user}.`);
    return;
  }

  params.runtime.log(
    `Systemd lingering is disabled for ${status.user}. Run: sudo loginctl enable-linger ${status.user}`,
  );
}
