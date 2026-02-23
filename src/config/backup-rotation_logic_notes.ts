/*
 * AUTO ANNOTATION
 * File: src/config/backup-rotation.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CONFIG_BACKUP_COUNT = 5;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function rotateConfigBackups(
  configPath: string,
  ioFs: {
    unlink: (path: string) => Promise<void>;
    rename: (from: string, to: string) => Promise<void>;
  },
): Promise<void> {
  if (CONFIG_BACKUP_COUNT <= 1) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const backupBase = `${configPath}.bak`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxIndex = CONFIG_BACKUP_COUNT - 1;
  await ioFs.unlink(`${backupBase}.${maxIndex}`).catch(() => {
    // best-effort
  });
  for (let index = maxIndex - 1; index >= 1; index -= 1) {
    await ioFs.rename(`${backupBase}.${index}`, `${backupBase}.${index + 1}`).catch(() => {
      // best-effort
    });
  }
  await ioFs.rename(backupBase, `${backupBase}.1`).catch(() => {
    // best-effort
  });
}
