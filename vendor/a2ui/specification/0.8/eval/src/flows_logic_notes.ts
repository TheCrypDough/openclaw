/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/specification/0.8/eval/src/flows.ts
 * Purpose: File in vendor area for project orchestration/configuration/data.
 * Module area: Vendored third-party code/assets (e.g., bundled UI runtime)
 * System effect: Change can influence vendored third-party code/assets (e.g., bundled ui runtime) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/*
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { googleAI } from "@genkit-ai/google-genai";
import { genkit, z } from "genkit";
import { openAI } from "@genkit-ai/compat-oai/openai";
import { anthropic } from "genkitx-anthropic";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const plugins = [];

if (process.env.GEMINI_API_KEY) {
  console.log("Initializing Google AI plugin...");
  plugins.push(
    googleAI({
      apiKey: process.env.GEMINI_API_KEY!,
      experimental_debugTraces: true,
    }),
  );
}
if (process.env.OPENAI_API_KEY) {
  console.log("Initializing OpenAI plugin...");
  plugins.push(openAI());
}
if (process.env.ANTHROPIC_API_KEY) {
  console.log("Initializing Anthropic plugin...");
  plugins.push(anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! }));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const ai = genkit({
  plugins,
});

// Define a UI component generator flow
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const componentGeneratorFlow = ai.defineFlow(
  {
    name: "componentGeneratorFlow",
    inputSchema: z.object({
      prompt: z.string(),
      model: z.any(),
      config: z.any().optional(),
      schema: z.any(),
    }),
    outputSchema: z.any(),
  },
  async ({ prompt, model, config, schema }) => {
    // Generate structured component data using the schema from the file
    const { output } = await ai.generate({
      prompt,
      model,
      output: { contentType: "application/json", jsonSchema: schema },
      config,
    });

    if (!output) throw new Error("Failed to generate component");

    return output;
  },
);
