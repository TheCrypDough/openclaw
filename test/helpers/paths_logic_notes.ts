/*
 * AUTO ANNOTATION
 * File: test/helpers/paths.ts
 * Purpose: Automated test for behavior validation (automated unit/e2e/live test suites).
 * Module area: Automated unit/e2e/live test suites
 * System effect: Affects confidence and CI coverage for system behavior, not production runtime by itself.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isPathWithinBase(base: string, target: string): boolean {
  if (process.platform === "win32") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalizedBase = path.win32.normalize(path.win32.resolve(base));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalizedTarget = path.win32.normalize(path.win32.resolve(target));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rel = path.win32.relative(normalizedBase.toLowerCase(), normalizedTarget.toLowerCase());
    return rel === "" || (!rel.startsWith("..") && !path.win32.isAbsolute(rel));
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedBase = path.resolve(base);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedTarget = path.resolve(target);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rel = path.relative(normalizedBase, normalizedTarget);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}
