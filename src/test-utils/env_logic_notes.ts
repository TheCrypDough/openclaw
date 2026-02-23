/*
 * AUTO ANNOTATION
 * File: src/test-utils/env.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function captureEnv(keys: string[]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot = new Map<string, string | undefined>();
  for (const key of keys) {
    snapshot.set(key, process.env[key]);
  }

  return {
    restore() {
      for (const [key, value] of snapshot) {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function captureFullEnv() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot: Record<string, string | undefined> = { ...process.env };

  return {
    restore() {
      for (const key of Object.keys(process.env)) {
        if (!(key in snapshot)) {
          delete process.env[key];
        }
      }
      for (const [key, value] of Object.entries(snapshot)) {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function withEnv<T>(env: Record<string, string | undefined>, fn: () => T): T {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot = captureEnv(Object.keys(env));
  try {
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    return fn();
  } finally {
    snapshot.restore();
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withEnvAsync<T>(
  env: Record<string, string | undefined>,
  fn: () => Promise<T>,
): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot = captureEnv(Object.keys(env));
  try {
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    return await fn();
  } finally {
    snapshot.restore();
  }
}
