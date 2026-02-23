/*
 * AUTO ANNOTATION
 * File: scripts/protocol-gen.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (protocol-gen.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ProtocolSchemas } from "../src/gateway/protocol/schema.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const repoRoot = path.resolve(__dirname, "..");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function writeJsonSchema() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const definitions: Record<string, unknown> = {};
  for (const [name, schema] of Object.entries(ProtocolSchemas)) {
    definitions[name] = schema;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rootSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://openclaw.ai/protocol.schema.json",
    title: "OpenClaw Gateway Protocol",
    description: "Handshake, request/response, and event frames for the Gateway WebSocket.",
    oneOf: [
      { $ref: "#/definitions/RequestFrame" },
      { $ref: "#/definitions/ResponseFrame" },
      { $ref: "#/definitions/EventFrame" },
    ],
    discriminator: {
      propertyName: "type",
      mapping: {
        req: "#/definitions/RequestFrame",
        res: "#/definitions/ResponseFrame",
        event: "#/definitions/EventFrame",
      },
    },
    definitions,
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const distDir = path.join(repoRoot, "dist");
  await fs.mkdir(distDir, { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const jsonSchemaPath = path.join(distDir, "protocol.schema.json");
  await fs.writeFile(jsonSchemaPath, JSON.stringify(rootSchema, null, 2));
  console.log(`wrote ${jsonSchemaPath}`);
  return { jsonSchemaPath, schemaString: JSON.stringify(rootSchema) };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function main() {
  await writeJsonSchema();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
