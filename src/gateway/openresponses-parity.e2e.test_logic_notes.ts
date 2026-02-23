/*
 * AUTO ANNOTATION
 * File: src/gateway/openresponses-parity.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * OpenResponses Feature Parity E2E Tests
 *
 * Tests for input_image, input_file, and client-side tools (Hosted Tools)
 * support in the OpenResponses `/v1/responses` endpoint.
 */

import { beforeAll, describe, it, expect } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let InputImageContentPartSchema: typeof import("./open-responses.schema.js").InputImageContentPartSchema;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let InputFileContentPartSchema: typeof import("./open-responses.schema.js").InputFileContentPartSchema;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let ToolDefinitionSchema: typeof import("./open-responses.schema.js").ToolDefinitionSchema;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let CreateResponseBodySchema: typeof import("./open-responses.schema.js").CreateResponseBodySchema;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let OutputItemSchema: typeof import("./open-responses.schema.js").OutputItemSchema;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let buildAgentPrompt: typeof import("./openresponses-http.js").buildAgentPrompt;

describe("OpenResponses Feature Parity", () => {
  beforeAll(async () => {
    ({
      InputImageContentPartSchema,
      InputFileContentPartSchema,
      ToolDefinitionSchema,
      CreateResponseBodySchema,
      OutputItemSchema,
    } = await import("./open-responses.schema.js"));
    ({ buildAgentPrompt } = await import("./openresponses-http.js"));
  });

  describe("Schema Validation", () => {
    it("should validate input_image with url source", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const validImage = {
        type: "input_image" as const,
        source: {
          type: "url" as const,
          url: "https://example.com/image.png",
        },
      };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = InputImageContentPartSchema.safeParse(validImage);
      expect(result.success).toBe(true);
    });

    it("should validate input_image with base64 source", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const validImage = {
        type: "input_image" as const,
        source: {
          type: "base64" as const,
          media_type: "image/png" as const,
          data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        },
      };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = InputImageContentPartSchema.safeParse(validImage);
      expect(result.success).toBe(true);
    });

    it("should reject input_image with invalid mime type", async () => {
      const invalidImage = {
        type: "input_image" as const,
        source: {
          type: "base64" as const,
          media_type: "application/json" as const, // Not an image
          data: "SGVsbG8gV29ybGQh",
        },
      };

      const result = InputImageContentPartSchema.safeParse(invalidImage);
      expect(result.success).toBe(false);
    });

    it("should validate input_file with url source", async () => {
      const validFile = {
        type: "input_file" as const,
        source: {
          type: "url" as const,
          url: "https://example.com/document.txt",
        },
      };

      const result = InputFileContentPartSchema.safeParse(validFile);
      expect(result.success).toBe(true);
    });

    it("should validate input_file with base64 source", async () => {
      const validFile = {
        type: "input_file" as const,
        source: {
          type: "base64" as const,
          media_type: "text/plain" as const,
          data: "SGVsbG8gV29ybGQh",
          filename: "hello.txt",
        },
      };

      const result = InputFileContentPartSchema.safeParse(validFile);
      expect(result.success).toBe(true);
    });

    it("should validate tool definition", async () => {
      const validTool = {
        type: "function" as const,
        function: {
          name: "get_weather",
          description: "Get the current weather",
          parameters: {
            type: "object",
            properties: {
              location: { type: "string" },
            },
            required: ["location"],
          },
        },
      };

      const result = ToolDefinitionSchema.safeParse(validTool);
      expect(result.success).toBe(true);
    });

    it("should reject tool definition without name", async () => {
      const invalidTool = {
        type: "function" as const,
        function: {
          name: "", // Empty name
          description: "Get the current weather",
        },
      };

      const result = ToolDefinitionSchema.safeParse(invalidTool);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateResponseBody Schema", () => {
    it("should validate request with input_image", async () => {
      const validRequest = {
        model: "claude-sonnet-4-20250514",
        input: [
          {
            type: "message" as const,
            role: "user" as const,
            content: [
              {
                type: "input_image" as const,
                source: {
                  type: "url" as const,
                  url: "https://example.com/photo.jpg",
                },
              },
              {
                type: "input_text" as const,
                text: "What's in this image?",
              },
            ],
          },
        ],
      };

      const result = CreateResponseBodySchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it("should validate request with client tools", async () => {
      const validRequest = {
        model: "claude-sonnet-4-20250514",
        input: [
          {
            type: "message" as const,
            role: "user" as const,
            content: "What's the weather?",
          },
        ],
        tools: [
          {
            type: "function" as const,
            function: {
              name: "get_weather",
              description: "Get weather for a location",
              parameters: {
                type: "object",
                properties: {
                  location: { type: "string" },
                },
                required: ["location"],
              },
            },
          },
        ],
      };

      const result = CreateResponseBodySchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it("should validate request with function_call_output for turn-based tools", async () => {
      const validRequest = {
        model: "claude-sonnet-4-20250514",
        input: [
          {
            type: "function_call_output" as const,
            call_id: "call_123",
            output: '{"temperature": "72°F", "condition": "sunny"}',
          },
        ],
      };

      const result = CreateResponseBodySchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it("should validate complete turn-based tool flow", async () => {
      const turn1Request = {
        model: "claude-sonnet-4-20250514",
        input: [
          {
            type: "message" as const,
            role: "user" as const,
            content: "What's the weather in San Francisco?",
          },
        ],
        tools: [
          {
            type: "function" as const,
            function: {
              name: "get_weather",
              description: "Get weather for a location",
            },
          },
        ],
      };

      const turn1Result = CreateResponseBodySchema.safeParse(turn1Request);
      expect(turn1Result.success).toBe(true);

      // Turn 2: Client provides tool output
      const turn2Request = {
        model: "claude-sonnet-4-20250514",
        input: [
          {
            type: "function_call_output" as const,
            call_id: "call_123",
            output: '{"temperature": "72°F", "condition": "sunny"}',
          },
        ],
      };

      const turn2Result = CreateResponseBodySchema.safeParse(turn2Request);
      expect(turn2Result.success).toBe(true);
    });
  });

  describe("Response Resource Schema", () => {
    it("should validate response with function_call output", async () => {
      const functionCallOutput = {
        type: "function_call" as const,
        id: "msg_123",
        call_id: "call_456",
        name: "get_weather",
        arguments: '{"location": "San Francisco"}',
      };

      const result = OutputItemSchema.safeParse(functionCallOutput);
      expect(result.success).toBe(true);
    });
  });

  describe("buildAgentPrompt", () => {
    it("should convert function_call_output to tool entry", async () => {
      const result = buildAgentPrompt([
        {
          type: "function_call_output" as const,
          call_id: "call_123",
          output: '{"temperature": "72°F"}',
        },
      ]);

      // When there's only a tool output (no history), returns just the body
      expect(result.message).toBe('{"temperature": "72°F"}');
    });

    it("should handle mixed message and function_call_output items", async () => {
      const result = buildAgentPrompt([
        {
          type: "message" as const,
          role: "user" as const,
          content: "What's the weather?",
        },
        {
          type: "function_call_output" as const,
          call_id: "call_123",
          output: '{"temperature": "72°F"}',
        },
        {
          type: "message" as const,
          role: "user" as const,
          content: "Thanks!",
        },
      ]);

      // Should include both user messages and tool output
      expect(result.message).toContain("weather");
      expect(result.message).toContain("72°F");
      expect(result.message).toContain("Thanks");
    });
  });
});
