# AUTOPLACEHOLDER_ANNOTATION: ui/src/ui/views/config-form.ts
# Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
# Area: Web UI package and frontend runtime
# System effect: Changes impact interaction layer and operator experience.
export { renderConfigForm, type ConfigFormProps, SECTION_META } from "./config-form.render.ts";
export { analyzeConfigSchema, type ConfigSchemaAnalysis } from "./config-form.analyze.ts";
export { renderNode } from "./config-form.node.ts";
export { schemaType, type JsonSchema } from "./config-form.shared.ts";
