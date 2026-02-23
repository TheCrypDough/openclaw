/*
 * AUTO ANNOTATION
 * File: src/cli/browser-cli-examples.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const browserCoreExamples = [
  "openclaw browser status",
  "openclaw browser start",
  "openclaw browser stop",
  "openclaw browser tabs",
  "openclaw browser open https://example.com",
  "openclaw browser focus abcd1234",
  "openclaw browser close abcd1234",
  "openclaw browser screenshot",
  "openclaw browser screenshot --full-page",
  "openclaw browser screenshot --ref 12",
  "openclaw browser snapshot",
  "openclaw browser snapshot --format aria --limit 200",
  "openclaw browser snapshot --efficient",
  "openclaw browser snapshot --labels",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const browserActionExamples = [
  "openclaw browser navigate https://example.com",
  "openclaw browser resize 1280 720",
  "openclaw browser click 12 --double",
  'openclaw browser type 23 "hello" --submit',
  "openclaw browser press Enter",
  "openclaw browser hover 44",
  "openclaw browser drag 10 11",
  "openclaw browser select 9 OptionA OptionB",
  "openclaw browser upload /tmp/openclaw/uploads/file.pdf",
  'openclaw browser fill --fields \'[{"ref":"1","value":"Ada"}]\'',
  "openclaw browser dialog --accept",
  'openclaw browser wait --text "Done"',
  "openclaw browser evaluate --fn '(el) => el.textContent' --ref 7",
  "openclaw browser console --level error",
  "openclaw browser pdf",
];
