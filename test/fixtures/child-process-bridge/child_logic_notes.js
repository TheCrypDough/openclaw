/*
 * AUTO ANNOTATION
 * File: test/fixtures/child-process-bridge/child.js
 * Purpose: Automated test for behavior validation (automated unit/e2e/live test suites).
 * Module area: Automated unit/e2e/live test suites
 * System effect: Affects confidence and CI coverage for system behavior, not production runtime by itself.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
process.stdout.write("ready\n");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const keepAlive = setInterval(() => {}, 1000);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const shutdown = () => {
  clearInterval(keepAlive);
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
