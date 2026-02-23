/*
 * AUTO ANNOTATION
 * File: ui/src/ui/text-direction.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * RTL (Right-to-Left) text direction detection.
 * Detects Hebrew, Arabic, Syriac, Thaana, Nko, Samaritan, Mandaic, Adlam,
 * Phoenician, and Lydian scripts using Unicode Script Properties.
 */

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RTL_CHAR_REGEX =
  /\p{Script=Hebrew}|\p{Script=Arabic}|\p{Script=Syriac}|\p{Script=Thaana}|\p{Script=Nko}|\p{Script=Samaritan}|\p{Script=Mandaic}|\p{Script=Adlam}|\p{Script=Phoenician}|\p{Script=Lydian}/u;

/**
 * Detect text direction from the first significant character.
 * @param text - The text to check
 * @param skipPattern - Characters to skip when looking for the first significant char.
 *   Defaults to whitespace and Unicode punctuation/symbols.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function detectTextDirection(
  text: string | null,
  skipPattern: RegExp = /[\s\p{P}\p{S}]/u,
): "rtl" | "ltr" {
  if (!text) {
    return "ltr";
  }
  for (const char of text) {
    if (skipPattern.test(char)) {
      continue;
    }
    return RTL_CHAR_REGEX.test(char) ? "rtl" : "ltr";
  }
  return "ltr";
}
