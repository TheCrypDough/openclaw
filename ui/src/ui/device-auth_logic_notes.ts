/*
 * AUTO ANNOTATION
 * File: ui/src/ui/device-auth.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  type DeviceAuthEntry,
  type DeviceAuthStore,
  normalizeDeviceAuthRole,
  normalizeDeviceAuthScopes,
} from "../../../src/shared/device-auth.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const STORAGE_KEY = "openclaw.device.auth.v1";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function readStore(): DeviceAuthStore | null {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as DeviceAuthStore;
    if (!parsed || parsed.version !== 1) {
      return null;
    }
    if (!parsed.deviceId || typeof parsed.deviceId !== "string") {
      return null;
    }
    if (!parsed.tokens || typeof parsed.tokens !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function writeStore(store: DeviceAuthStore) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // best-effort
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function loadDeviceAuthToken(params: {
  deviceId: string;
  role: string;
}): DeviceAuthEntry | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = readStore();
  if (!store || store.deviceId !== params.deviceId) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const role = normalizeDeviceAuthRole(params.role);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entry = store.tokens[role];
  if (!entry || typeof entry.token !== "string") {
    return null;
  }
  return entry;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function storeDeviceAuthToken(params: {
  deviceId: string;
  role: string;
  token: string;
  scopes?: string[];
}): DeviceAuthEntry {
  const role = normalizeDeviceAuthRole(params.role);
  const next: DeviceAuthStore = {
    version: 1,
    deviceId: params.deviceId,
    tokens: {},
  };
  const existing = readStore();
  if (existing && existing.deviceId === params.deviceId) {
    next.tokens = { ...existing.tokens };
  }
  const entry: DeviceAuthEntry = {
    token: params.token,
    role,
    scopes: normalizeDeviceAuthScopes(params.scopes),
    updatedAtMs: Date.now(),
  };
  next.tokens[role] = entry;
  writeStore(next);
  return entry;
}

export function clearDeviceAuthToken(params: { deviceId: string; role: string }) {
  const store = readStore();
  if (!store || store.deviceId !== params.deviceId) {
    return;
  }
  const role = normalizeDeviceAuthRole(params.role);
  if (!store.tokens[role]) {
    return;
  }
  const next = { ...store, tokens: { ...store.tokens } };
  delete next.tokens[role];
  writeStore(next);
}
