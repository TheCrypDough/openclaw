/*
 * AUTO ANNOTATION
 * File: src/memory/embeddings-voyage.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import * as authModule from "../agents/model-auth.js";
import { type FetchMock, withFetchPreconnect } from "../test-utils/fetch-mock.js";
import { createVoyageEmbeddingProvider, normalizeVoyageModel } from "./embeddings-voyage.js";

vi.mock("../agents/model-auth.js", async () => {
  const { createModelAuthMockModule } = await import("../test-utils/model-auth-mock.js");
  return createModelAuthMockModule();
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createFetchMock = () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fetchMock = vi.fn<FetchMock>(
    async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify({ data: [{ embedding: [0.1, 0.2, 0.3] }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
  );
  return withFetchPreconnect(fetchMock);
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function mockVoyageApiKey() {
  vi.mocked(authModule.resolveApiKeyForProvider).mockResolvedValue({
    apiKey: "voyage-key-123",
    mode: "api-key",
    source: "test",
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function createDefaultVoyageProvider(
  model: string,
  fetchMock: ReturnType<typeof createFetchMock>,
) {
  vi.stubGlobal("fetch", fetchMock);
  mockVoyageApiKey();
  return createVoyageEmbeddingProvider({
    config: {} as never,
    provider: "voyage",
    model,
    fallback: "none",
  });
}

describe("voyage embedding provider", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  it("configures client with correct defaults and headers", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchMock = createFetchMock();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await createDefaultVoyageProvider("voyage-4-large", fetchMock);

    await result.provider.embedQuery("test query");

    expect(authModule.resolveApiKeyForProvider).toHaveBeenCalledWith(
      expect.objectContaining({ provider: "voyage" }),
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const call = fetchMock.mock.calls[0];
    expect(call).toBeDefined();
    const [url, init] = call as [RequestInfo | URL, RequestInit | undefined];
    expect(url).toBe("https://api.voyageai.com/v1/embeddings");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer voyage-key-123");
    expect(headers["Content-Type"]).toBe("application/json");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const body = JSON.parse(init?.body as string);
    expect(body).toEqual({
      model: "voyage-4-large",
      input: ["test query"],
      input_type: "query",
    });
  });

  it("respects remote overrides for baseUrl and apiKey", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchMock = createFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const result = await createVoyageEmbeddingProvider({
      config: {} as never,
      provider: "voyage",
      model: "voyage-4-lite",
      fallback: "none",
      remote: {
        baseUrl: "https://proxy.example.com",
        apiKey: "remote-override-key",
        headers: { "X-Custom": "123" },
      },
    });

    await result.provider.embedQuery("test");

    const call = fetchMock.mock.calls[0];
    expect(call).toBeDefined();
    const [url, init] = call as [RequestInfo | URL, RequestInit | undefined];
    expect(url).toBe("https://proxy.example.com/embeddings");

    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer remote-override-key");
    expect(headers["X-Custom"]).toBe("123");
  });

  it("passes input_type=document for embedBatch", async () => {
    const fetchMock = withFetchPreconnect(
      vi.fn<FetchMock>(
        async (_input: RequestInfo | URL, _init?: RequestInit) =>
          new Response(
            JSON.stringify({
              data: [{ embedding: [0.1, 0.2] }, { embedding: [0.3, 0.4] }],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
      ),
    );
    const result = await createDefaultVoyageProvider("voyage-4-large", fetchMock);

    await result.provider.embedBatch(["doc1", "doc2"]);

    const call = fetchMock.mock.calls[0];
    expect(call).toBeDefined();
    const [, init] = call as [RequestInfo | URL, RequestInit | undefined];
    const body = JSON.parse(init?.body as string);
    expect(body).toEqual({
      model: "voyage-4-large",
      input: ["doc1", "doc2"],
      input_type: "document",
    });
  });

  it("normalizes model names", async () => {
    expect(normalizeVoyageModel("voyage/voyage-large-2")).toBe("voyage-large-2");
    expect(normalizeVoyageModel("voyage-4-large")).toBe("voyage-4-large");
    expect(normalizeVoyageModel("  voyage-lite  ")).toBe("voyage-lite");
    expect(normalizeVoyageModel("")).toBe("voyage-4-large"); // Default
  });
});
