/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-cli/a2ui-jsonl.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const A2UI_ACTION_KEYS = [
  "beginRendering",
  "surfaceUpdate",
  "dataModelUpdate",
  "deleteSurface",
  "createSurface",
] as const;

export type A2UIVersion = "v0.8" | "v0.9";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildA2UITextJsonl(text: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const surfaceId = "main";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rootId = "root";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const textId = "text";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payloads = [
    {
      surfaceUpdate: {
        surfaceId,
        components: [
          {
            id: rootId,
            component: { Column: { children: { explicitList: [textId] } } },
          },
          {
            id: textId,
            component: {
              Text: { text: { literalString: text }, usageHint: "body" },
            },
          },
        ],
      },
    },
    { beginRendering: { surfaceId, root: rootId } },
  ];
  return payloads.map((payload) => JSON.stringify(payload)).join("\n");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateA2UIJsonl(jsonl: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = jsonl.split(/\r?\n/);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const errors: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let sawV08 = false;
  let sawV09 = false;
  let messageCount = 0;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }
    messageCount += 1;
    let obj: unknown;
    try {
      obj = JSON.parse(trimmed) as unknown;
    } catch (err) {
      errors.push(`line ${idx + 1}: ${String(err)}`);
      return;
    }
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
      errors.push(`line ${idx + 1}: expected JSON object`);
      return;
    }
    const record = obj as Record<string, unknown>;
    const actionKeys = A2UI_ACTION_KEYS.filter((key) => key in record);
    if (actionKeys.length !== 1) {
      errors.push(
        `line ${idx + 1}: expected exactly one action key (${A2UI_ACTION_KEYS.join(", ")})`,
      );
      return;
    }
    if (actionKeys[0] === "createSurface") {
      sawV09 = true;
    } else {
      sawV08 = true;
    }
  });

  if (messageCount === 0) {
    errors.push("no JSONL messages found");
  }
  if (sawV08 && sawV09) {
    errors.push("mixed A2UI v0.8 and v0.9 messages in one file");
  }
  if (errors.length > 0) {
    throw new Error(`Invalid A2UI JSONL:\n- ${errors.join("\n- ")}`);
  }

  const version: A2UIVersion = sawV09 ? "v0.9" : "v0.8";
  return { version, messageCount };
}
