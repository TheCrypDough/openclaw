/*
 * AUTO ANNOTATION
 * File: scripts/update-clawtributors.types.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (update-clawtributors.types.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type MapConfig = {
  ensureLogins?: string[];
  displayName?: Record<string, string>;
  nameToLogin?: Record<string, string>;
  emailToLogin?: Record<string, string>;
  placeholderAvatar?: string;
  seedCommit?: string;
};

export type ApiContributor = {
  login?: string;
  html_url?: string;
  avatar_url?: string;
  name?: string;
  email?: string;
  contributions?: number;
};

export type User = {
  login: string;
  html_url: string;
  avatar_url: string;
};

export type Entry = {
  key: string;
  login?: string;
  display: string;
  html_url: string;
  avatar_url: string;
  lines: number;
};
