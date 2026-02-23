/*
 * AUTO ANNOTATION
 * File: src/gateway/test-helpers.openai-mock.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type OpenAIResponsesParams = {
  input?: unknown[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type OpenAIResponseStreamEvent =
  | { type: "response.output_item.added"; item: Record<string, unknown> }
  | { type: "response.function_call_arguments.delta"; delta: string }
  | { type: "response.output_item.done"; item: Record<string, unknown> }
  | {
      type: "response.completed";
      response: {
        status: "completed";
        usage: {
          input_tokens: number;
          output_tokens: number;
          total_tokens: number;
          input_tokens_details?: { cached_tokens?: number };
        };
      };
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function extractLastUserText(input: unknown[]): string {
  for (let i = input.length - 1; i >= 0; i -= 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const item = input[i] as Record<string, unknown> | undefined;
    if (!item || item.role !== "user") {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content = item.content;
    if (Array.isArray(content)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = content
        .filter(
          (c): c is { type: "input_text"; text: string } =>
            !!c &&
            typeof c === "object" &&
            (c as { type?: unknown }).type === "input_text" &&
            typeof (c as { text?: unknown }).text === "string",
        )
        .map((c) => c.text)
        .join("\n")
        .trim();
      if (text) {
        return text;
      }
    }
  }
  return "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function extractToolOutput(input: unknown[]): string {
  for (const itemRaw of input) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const item = itemRaw as Record<string, unknown> | undefined;
    if (!item || item.type !== "function_call_output") {
      continue;
    }
    return typeof item.output === "string" ? item.output : "";
  }
  return "";
}

async function* fakeOpenAIResponsesStream(
  params: OpenAIResponsesParams,
): AsyncGenerator<OpenAIResponseStreamEvent> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const input = Array.isArray(params.input) ? params.input : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const toolOutput = extractToolOutput(input);

  if (!toolOutput) {
    const prompt = extractLastUserText(input);
    const quoted = /"([^"]+)"/.exec(prompt)?.[1];
    const toolPath = quoted ?? "package.json";
    const argsJson = JSON.stringify({ path: toolPath });

    yield {
      type: "response.output_item.added",
      item: {
        type: "function_call",
        id: "fc_test_1",
        call_id: "call_test_1",
        name: "read",
        arguments: "",
      },
    };
    yield { type: "response.function_call_arguments.delta", delta: argsJson };
    yield {
      type: "response.output_item.done",
      item: {
        type: "function_call",
        id: "fc_test_1",
        call_id: "call_test_1",
        name: "read",
        arguments: argsJson,
      },
    };
    yield {
      type: "response.completed",
      response: {
        status: "completed",
        usage: { input_tokens: 10, output_tokens: 10, total_tokens: 20 },
      },
    };
    return;
  }

  const nonceA = /nonceA=([^\s]+)/.exec(toolOutput)?.[1] ?? "";
  const nonceB = /nonceB=([^\s]+)/.exec(toolOutput)?.[1] ?? "";
  const reply = `${nonceA} ${nonceB}`.trim();

  yield {
    type: "response.output_item.added",
    item: {
      type: "message",
      id: "msg_test_1",
      role: "assistant",
      content: [],
      status: "in_progress",
    },
  };
  yield {
    type: "response.output_item.done",
    item: {
      type: "message",
      id: "msg_test_1",
      role: "assistant",
      status: "completed",
      content: [{ type: "output_text", text: reply, annotations: [] }],
    },
  };
  yield {
    type: "response.completed",
    response: {
      status: "completed",
      usage: { input_tokens: 10, output_tokens: 10, total_tokens: 20 },
    },
  };
}

function decodeBodyText(body: unknown): string {
  if (!body) {
    return "";
  }
  if (typeof body === "string") {
    return body;
  }
  if (body instanceof Uint8Array) {
    return Buffer.from(body).toString("utf8");
  }
  if (body instanceof ArrayBuffer) {
    return Buffer.from(new Uint8Array(body)).toString("utf8");
  }
  return "";
}

async function buildOpenAIResponsesSse(params: OpenAIResponsesParams): Promise<Response> {
  const events: OpenAIResponseStreamEvent[] = [];
  for await (const event of fakeOpenAIResponsesStream(params)) {
    events.push(event);
  }

  const sse = `${events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("")}data: [DONE]\n\n`;
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(sse));
      controller.close();
    },
  });
  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/event-stream" },
  });
}

export function installOpenAiResponsesMock(params?: { baseUrl?: string }) {
  const originalFetch = globalThis.fetch;
  const baseUrl = params?.baseUrl ?? "https://api.openai.com/v1";
  const responsesUrl = `${baseUrl}/responses`;
  const isResponsesRequest = (url: string) =>
    url === responsesUrl ||
    url.startsWith(`${responsesUrl}/`) ||
    url.startsWith(`${responsesUrl}?`);
  const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (isResponsesRequest(url)) {
      const bodyText =
        typeof (init as { body?: unknown } | undefined)?.body !== "undefined"
          ? decodeBodyText((init as { body?: unknown }).body)
          : input instanceof Request
            ? await input.clone().text()
            : "";

      const parsed = bodyText ? (JSON.parse(bodyText) as Record<string, unknown>) : {};
      const inputItems = Array.isArray(parsed.input) ? parsed.input : [];
      return await buildOpenAIResponsesSse({ input: inputItems });
    }
    if (url.startsWith(baseUrl)) {
      throw new Error(`unexpected OpenAI request in mock test: ${url}`);
    }

    if (!originalFetch) {
      throw new Error(`fetch is not available (url=${url})`);
    }
    return await originalFetch(input, init);
  };
  (globalThis as unknown as { fetch: unknown }).fetch = fetchImpl;
  return {
    baseUrl,
    restore: () => {
      (globalThis as unknown as { fetch: unknown }).fetch = originalFetch;
    },
  };
}
